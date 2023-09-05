import { Injectable } from '@angular/core';
import { CheckLengthInterface } from '@interfaces/services/validation/check-length.interface';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  constructor() {}

  isEmailCorrect(email: string) {
    if (email) {
      const regex = new RegExp(
        "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
      );
      return regex.test(email);
    } else return email === '';
  }

  async checkPasswordsRules(password: string) {
    const rules: {
      eightChars: string;
      lower: string;
      spec: string;
      digit: string;
      upper: string;
    } = {
      eightChars: 'Password length should be more than 8 characters',
      lower: 'Password should contain at least one lowercase character',
      spec: 'Password should contain at least one special character',
      digit: 'Password should contain at least one digit character',
      upper: 'Password should contain at least one uppercase character'
    };

    const passwordRules = [
      { error: true, text: rules.eightChars },
      { error: true, text: rules.lower },
      { error: true, text: rules.spec },
      { error: true, text: rules.digit },
      { error: true, text: rules.upper }
    ];

    if (password) {
      if (password.length >= 8) {
        passwordRules[0].error = false;
      }
      if (/[a-z]/.test(password)) {
        passwordRules[1].error = false;
      }
      if (/[#?!@$%^&*-]/.test(password)) {
        passwordRules[2].error = false;
      }
      if (/\d/.test(password)) {
        passwordRules[3].error = false;
      }
      if (/[A-Z]/.test(password)) {
        passwordRules[4].error = false;
      }
    }
    return passwordRules;
  }

  checkLength({ str, min, max }: CheckLengthInterface) {
    if (!str) return true;

    const length = str.length;

    if (min !== undefined && max !== undefined) {
      return length >= min && length <= max;
    } else if (min !== undefined) {
      return length >= min;
    } else if (max !== undefined) {
      return length <= max;
    }

    return false;
  }
}
