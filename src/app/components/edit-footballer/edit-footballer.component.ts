import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FootballerService } from '../../services/footballer.service';
import { Footballer } from '../../models/footballer.model';

@Component({
  selector: 'app-edit-footballer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatCheckboxModule
  ],
  templateUrl: './edit-footballer.component.html',
  styleUrls: ['./edit-footballer.component.css']
})
export class EditFootballerComponent implements OnInit {
  footballerForm!: FormGroup;
  positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
  footballerId!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private footballerService: FootballerService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.footballerId = this.route.snapshot.paramMap.get('id')!;
    this.loadFootballer();
  }

  loadFootballer(): void {
    this.footballerService.getFootballerById(this.footballerId).subscribe({
      next: (player) => {
        this.initializeForm(player);
      },
      error: () => {
        this.snackBar.open('Player not found', 'Close', { duration: 3000 });
        this.router.navigate(['/database']);
      }
    });
  }

  initializeForm(player: Footballer): void {
    this.footballerForm = this.fb.group({
      name: [player.name, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      age: [player.age, [Validators.required, Validators.min(16), Validators.max(50)]],
      position: [player.position, Validators.required],
      team: [player.team, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      nationality: [player.nationality || ''],
      retired: [player.retired ?? false]
    });
  }

  onSubmit(): void {
    if (this.footballerForm.valid) {
      const updated = {
        ...this.footballerForm.value,
        age: Number(this.footballerForm.value.age)
      };

      this.footballerService.updateFootballer(this.footballerId, updated).subscribe({
        next: () => {
          this.snackBar.open('Player updated successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/database']);
        },
        error: () => {
          this.snackBar.open('Error updating player. Try again.', 'Close', { duration: 3000 });
        }
      });
    }
  }

  getErrorMessage(fieldName: string): string {
    const field = this.footballerForm.get(fieldName);
    if (field?.hasError('required')) return `${fieldName} is required`;
    if (field?.hasError('minlength')) return `${fieldName} too short`;
    if (field?.hasError('maxlength')) return `${fieldName} too long`;
    if (field?.hasError('min')) return `${fieldName} too small`;
    if (field?.hasError('max')) return `${fieldName} too large`;
    return '';
  }
}
