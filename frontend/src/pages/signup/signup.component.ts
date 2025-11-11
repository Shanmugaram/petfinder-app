import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonService } from '../../services/common/common.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxSpinnerModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  user: any = {};

  constructor(
    public commonService: CommonService,
    private spinner: NgxSpinnerService
  ) {}

  onSubmit(signupform: NgForm): void {
    this.spinner.show();

    if (signupform.valid) {
      // ✅ Correct backend endpoint
      this.commonService.postRequest('signup', this.user)
        .then((signupresponse: any) => {
          this.spinner.hide();

          if (signupresponse.status) {
            this.commonService.alert('Success', signupresponse.message);
            this.commonService.redirectTo('/signin');
          } else {
            this.commonService.alert('Error', signupresponse.message);
          }
        })
        .catch((signuperr: any) => {
          this.spinner.hide();
          this.commonService.alert('Error', signuperr.message || 'Something went wrong');
        });
    } else {
      this.spinner.hide();
      this.commonService.alert('Error', 'Invalid input field');
    }
  }
}

