import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { FootballerService } from '../../services/footballer.service';
import { Footballer } from '../../models/footballer.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footballer-database',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    RouterModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTableModule,
    MatTooltipModule
  ],
  templateUrl: './footballer-database.component.html',
  styleUrls: ['./footballer-database.component.css']
})
export class FootballerDatabaseComponent implements OnInit {
  @ViewChild(MatTable) table!: MatTable<Footballer>;

  footballers: Footballer[] = [];
  filteredFootballers: Footballer[] = [];
  searchName: string = '';
  searchTeam: string = '';
  searchNationality: string = '';
  searchPosition: string = '';
  searchRetired: string = ''; // "" | "true" | "false"

  positions: string[] = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
  displayedColumns: string[] = ['name', 'age', 'position', 'team', 'nationality', 'retired', 'edit', 'actions'];

  sort = { active: '', direction: 'asc' as 'asc' | 'desc' };

  constructor(
    private footballerService: FootballerService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadFootballers();
  }

  loadFootballers(): void {
    this.footballerService.getAllFootballers().subscribe({
      next: (data) => {
        this.footballers = data.map(f => ({ ...f, retired: f.retired ?? false }));
        this.filteredFootballers = [...this.footballers];
        this.sort.active = '';
        this.sort.direction = 'asc';
      },
      error: (error) => {
        this.snackBar.open('Error loading players', 'Close', { duration: 3000 });
        console.error(error);
      }
    });
  }

  searchFootballers(): void {
    this.filteredFootballers = this.footballers.filter(f => {
      const matchesName = this.searchName ? f.name.toLowerCase().includes(this.searchName.toLowerCase()) : true;
      const matchesTeam = this.searchTeam ? f.team.toLowerCase().includes(this.searchTeam.toLowerCase()) : true;
      const matchesNationality = this.searchNationality ? (f.nationality || '').toLowerCase().includes(this.searchNationality.toLowerCase()) : true;
      const matchesPosition = this.searchPosition ? f.position === this.searchPosition : true;
      const matchesRetired =
        this.searchRetired === ''
          ? true
          : this.searchRetired === 'true'
          ? f.retired === true
          : f.retired === false;

      return matchesName && matchesTeam && matchesNationality && matchesPosition && matchesRetired;
    });

    if (this.sort.active) {
      this.sortColumn(this.sort.active as 'age' | 'team' | 'nationality', false);
    } else {
      this.refreshTable();
    }
  }

  clearSearch(): void {
    this.searchName = '';
    this.searchTeam = '';
    this.searchNationality = '';
    this.searchPosition = '';
    this.searchRetired = '';
    this.filteredFootballers = [...this.footballers];
    this.sort.active = '';
    this.sort.direction = 'asc';
    this.refreshTable();
  }

  deleteFootballer(id: string | undefined): void {
    if (!id) return;
    if (confirm('Are you sure you want to delete this player?')) {
      this.footballerService.deleteFootballer(id).subscribe({
        next: () => {
          this.snackBar.open('Player deleted successfully', 'Close', { duration: 3000 });
          this.loadFootballers();
        },
        error: (error) => {
          this.snackBar.open('Error deleting player', 'Close', { duration: 3000 });
          console.error(error);
        }
      });
    }
  }

  sortColumn(column: 'age' | 'team' | 'nationality', toggleDirection: boolean = true): void {
    if (toggleDirection) {
      if (this.sort.active === column) {
        this.sort.direction = this.sort.direction === 'asc' ? 'desc' : 'asc';
      } else {
        this.sort.active = column;
        this.sort.direction = 'asc';
      }
    }

    this.filteredFootballers.sort((a, b) => {
      let valueA: any = a[column];
      let valueB: any = b[column];

      if (column === 'age') {
        valueA = Number(valueA) || 0;
        valueB = Number(valueB) || 0;
      } else {
        valueA = (valueA || '').toLowerCase();
        valueB = (valueB || '').toLowerCase();
      }

      if (valueA < valueB) return this.sort.direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sort.direction === 'asc' ? 1 : -1;
      return 0;
    });

    this.refreshTable();
  }

  refreshTable(): void {
    if (this.table) this.table.renderRows();
  }

  isSortedAsc(column: string): boolean {
    return this.sort.active === column && this.sort.direction === 'asc';
  }

  isSortedDesc(column: string): boolean {
    return this.sort.active === column && this.sort.direction === 'desc';
  }
}