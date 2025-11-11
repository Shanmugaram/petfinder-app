import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonService } from '../../services/common/common.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-forgotpassword',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxSpinnerModule],
  templateUrl: './forgotpassword.component.html',
  styleUrl: './forgotpassword.component.scss'
})
export class ForgotpasswordComponent {
  useremail: string = '';

  constructor(
    public commonService: CommonService,
    private spinner: NgxSpinnerService
  ) {}

  onSubmit(forgotpwForm: NgForm): void {
    this.spinner.show();

    if (forgotpwForm.valid) {
      this.commonService
        .postRequest('auth/forgot_password', { useremail: this.useremail })
        .then((fwresponse: any) => {
          if (fwresponse.status) {
            this.commonService.alert('Success', fwresponse.message);
            if (fwresponse.data) {
              window.open(fwresponse.data, '_blank');
            }
          } else {
            this.commonService.alert('Error', fwresponse.message);
          }
          this.spinner.hide();
        })
        .catch((fwperr: any) => {
          this.spinner.hide();
          this.commonService.alert('Error', 'Something went wrong. Please try again!');
        });
    } else {
      this.spinner.hide();
      this.commonService.alert('Error', 'Invalid input field');
    }
  }
}

