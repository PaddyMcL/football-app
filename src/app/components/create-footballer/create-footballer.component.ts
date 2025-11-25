import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FootballerService } from '../../services/footballer.service';

@Component({
  selector: 'app-create-footballer',
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
  templateUrl: './create-footballer.component.html',
  styleUrls: ['./create-footballer.component.css']
})
export class CreateFootballerComponent {
  footballerForm: FormGroup;
  positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];

  constructor(
    private fb: FormBuilder,
    private footballerService: FootballerService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.footballerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      age: ['', [Validators.required, Validators.min(16), Validators.max(50)]],
      position: ['', Validators.required],
      team: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      nationality: [''],
      retired: [false]
    });
  }

  onSubmit(): void {
    if (this.footballerForm.valid) {
      const footballerData = {
        ...this.footballerForm.value,
        age: Number(this.footballerForm.value.age)
      };

      this.footballerService.createFootballer(footballerData).subscribe({
        next: () => {
          this.snackBar.open('Player created successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/database']);
        },
        error: () => {
          this.snackBar.open('Error creating player. Please try again.', 'Close', { duration: 3000 });
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