import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';

@Pipe({
  name: 'dayjs'
})
export class DayjsPipe implements PipeTransform {
  transform(
    value: string | Date | null | undefined,
    format: string = 'YYYY-MM-DD'
  ): string {
    if (!value) {
      return '';
    }

    return dayjs(value).format(format);
  }
}
