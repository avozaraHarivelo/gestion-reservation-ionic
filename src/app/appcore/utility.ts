import { isMoment } from 'moment';

export class Utility {
  static monthNames: string[] = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  public static getWeek(currentYear: number, currentMonth: number, startDayOfWeek: number) {
    const date = new Date(currentYear, currentMonth, startDayOfWeek);
    const onejan = new Date(date.getFullYear(), 0, 1);
    const week = Math.ceil((((date.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
    return week;

  }
  public static toString(value: any): string {
    let valret = '';
    if (value === undefined) {
      return valret;
    }
    valret = value.toString().trim();
    return valret;
  }

  public static toInteger(value: any): number {
    let valret = 0;
    if (value === undefined) {
      return valret;
    }
    const str = value.toString().trim();
    valret = parseInt(str, 10);
    return valret;
  }

  public static toDecimal(value: any, removecomma = true): number {
    let valret = 0;
    if (value === undefined) {
      return valret;
    }
    const str = value.toString().trim();
    if (removecomma === true) {
      valret = parseFloat(str.replace(',', '.'));
    } else {
      valret = str;
    }
    return valret;
  }

  public static toDateString(value: any, sep: string = '/'): string {
    if (!value) {
      return '';
    }
    let amg = value;
    if (isMoment(value)) {
      const d = value.date();
      const m = value.months() + 1;
      const y = value.year();
      amg = y + sep + m + sep + d;
    } else if (value instanceof Date) {
      const d = value.getDate();
      const m = value.getMonth() + 1;
      const y = value.getFullYear();
      amg = y + sep + m + sep + d;
    } else {
      const index = amg.indexOf('T');
      if (index !== -1) {
        amg = amg.substring(0, index);
      }
    }
    return amg;
  }

  public static toDate(value: any): Date {
    let date = value;
    if (isMoment(value)) {
      const d = value.date();
      const m = value.months();
      const y = value.year();
      date = new Date(y, m, d);
    }
    return date;
  }

  public static  getDayOfYear(date: Date): number {
    const startOfYear = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24; // Milliseconds in a day
    const dayOfYear = Math.floor(diff / oneDay);
    return dayOfYear;
  }
  


  public static getDaysInYear(year: number) {
    // Vérifier si l'année est bissextile
    function isLeapYear(year: number) {
      return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    // Nombre de jours dans chaque mois (non bissextile)
    const daysInMonth = [
      31, // Janvier
      28, // Février
      31, // Mars
      30, // Avril
      31, // Mai
      30, // Juin
      31, // Juillet
      31, // Août
      30, // Septembre
      31, // Octobre
      30, // Novembre
      31, // Décembre
    ];

    // Si l'année est bissextile, modifier le nombre de jours en février (index 1)
    if (isLeapYear(year)) {
      daysInMonth[1] = 29;
    }

    // Calculer le nombre total de jours dans l'année en ajoutant les jours de chaque mois
    const totalDaysInYear = daysInMonth.reduce((sum, days) => sum + days, 0);

    return totalDaysInYear;
  }

  // Fonction pour obtenir le nombre de jours dans un mois donné
  public static getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
  }

  static getWeeksInYear(year: number): number {
    const firstDayOfYear = new Date(year, 0, 1);
    const lastDayOfYear = new Date(year, 11, 31);

    // Calculate the difference in days between the last day of the year and the first Monday of the year
    const daysUntilFirstMonday = (7 - firstDayOfYear.getDay() + 1) % 7;

    // Calculate the difference in days between the last Sunday of the year and the last day of the year
    const daysUntilLastSunday = (lastDayOfYear.getDay() === 0) ? 0 : 7 - lastDayOfYear.getDay();

    // Calculate the total number of days in the year minus the days at the beginning and end that are not part of full weeks
    const totalDaysInYear = (Date.UTC(year + 1, 0, 1) - Date.UTC(year, 0, 1)) / (1000 * 60 * 60 * 24);
    const daysInFullWeeks = totalDaysInYear - daysUntilFirstMonday - daysUntilLastSunday;

    // Calculate the number of full weeks in the year
    const fullWeeks = Math.floor(daysInFullWeeks / 7);

    // Add one to account for the partial week at the beginning or end
    return fullWeeks + 1;
  }

  static getDateOfWeek(year: number, weekNumber: number): Date {
    // Calculate the date of the first day of the year
    const firstDayOfYear = new Date(year, 0, 1);

    // Calculate the date of the first Monday of the year
    const daysUntilFirstMonday = (7 - firstDayOfYear.getDay() + 1) % 7;
    const firstMonday = new Date(firstDayOfYear);
    firstMonday.setDate(firstDayOfYear.getDate() + daysUntilFirstMonday);

    // Calculate the date of the requested week
    const daysToAdd = (weekNumber - 1) * 7;
    const targetDate = new Date(firstMonday);
    targetDate.setDate(firstMonday.getDate() + daysToAdd);

    return targetDate;
  }

  public static getMonthName(monthNumber: number): string {


    if (monthNumber >= 0 && monthNumber <= 11) {
      return this.monthNames[monthNumber];
    } else {
      return '';
    }
  }

}
