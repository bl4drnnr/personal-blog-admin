import { Injectable } from '@angular/core';
import { CheckLengthInterface } from '@interfaces/services/validation/check-length.interface';
import { MfaButtonDisableInterface } from '@interfaces/services/validation/mfa-button-disable.interface';
import { TranslationService } from '@services/translation.service';
import { ComponentsTranslation } from '@translations/components.enum';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  constructor(
    private readonly translationService: TranslationService
  ) {}

  isEmailCorrect(email: string) {
    if (email) {
      const regex = new RegExp(
        "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
      );
      return regex.test(email);
    } else return email === '';
  }

  mfaButtonDisable({
    isMfaRequired,
    mfaCode
  }: MfaButtonDisableInterface) {
    return isMfaRequired && mfaCode?.length !== 6;
  }

  async checkPasswordsRules(password: string) {
    const rules: {
      eightChars: string;
      lower: string;
      spec: string;
      digit: string;
      upper: string;
    } = await this.translationService.translateObject(
      'passwordRules',
      ComponentsTranslation.INPUT
    );

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

  checkRecoveryKeys(recoveryKeys: Array<string>) {
    let corruptedKey = false;

    if (recoveryKeys.length !== 5) return false;
    else
      recoveryKeys.forEach(
        (key) => (corruptedKey = key.length !== 1024)
      );

    return !corruptedKey;
  }

  areArraysEqual(arr1: any[], arr2: any[]): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }

    const sortedArr1 = arr1
      .map((item) =>
        typeof item === 'string' ? item.toLowerCase() : item
      )
      .sort();

    const sortedArr2 = arr2
      .map((item) =>
        typeof item === 'string' ? item.toLowerCase() : item
      )
      .sort();

    return sortedArr1.every(
      (value, index) => value === sortedArr2[index]
    );
  }

  areArraysObjectEqual<T>(arr1: T[], arr2: T[]): boolean {
    const arr1Sorted = arr1.map((obj) => JSON.stringify(obj)).sort();
    const arr2Sorted = arr2.map((obj) => JSON.stringify(obj)).sort();

    if (arr1Sorted.length !== arr2Sorted.length) {
      return false;
    }

    for (let i = 0; i < arr1Sorted.length; i++) {
      if (arr1Sorted[i] !== arr2Sorted[i]) {
        return false;
      }
    }

    return true;
  }

  deleteObjectFromArray(
    arr: Array<any>,
    key: string,
    value: any
  ): Array<any> {
    return arr.filter((item) => item[key] !== value);
  }
}
