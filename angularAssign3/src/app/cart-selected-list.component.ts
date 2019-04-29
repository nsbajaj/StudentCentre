import { Component, OnInit, Input, DoCheck } from '@angular/core';

import { Course } from './dataModelClasses';

@Component({
  selector: 'app-cart-selected-list',
  templateUrl: './cart-selected-list.component.html',
  styleUrls: ['./cart-selected-list.component.css']
})
export class CartSelectedListComponent implements OnInit, DoCheck {

  // Properties
  // ############################################################

  // Passed-in collection of courses selected
  @Input()
  coursesSelected: Course[];

  // A copy of coursesSelected, for the user interface, with additional properties
  coursesSelectedForUI: any[];

  // Initialization
  // ############################################################

  constructor() { }

  ngOnInit() { }

  ngDoCheck() {

    // Prepare the collection to be rendered in the UI
    this.coursesSelectedForUI = [];
    // Copy the incoming collection, and add new property to each object
    // Uses the JavaScript "spread" syntax
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#Spread_in_object_literals
    this.coursesSelected.forEach(c => {
      this.coursesSelectedForUI.push({ ...c, gridCells: this.getPeriods(c) });
    });
    // Sort the result
    this.coursesSelectedForUI.sort((a, b) => a.gridCells[0] - b.gridCells[0]);
  }

  
  // Class methods
  // ############################################################

  // This determines the timetable period numbers, which are used for sorting and displaying
  private getPeriods(c: Course): number[] {

    // The grid has 75 cells, 15 per day, Monday through Friday

    // Initialize the day, which will also work for Monday
    let day = 1;
    if (c.classTue == 'Y') day = 16;
    if (c.classWed == 'Y') day = 31;
    if (c.classThu == 'Y') day = 46;
    if (c.classFri == 'Y') day = 61;

    // Initialize the periods, time start
    let timesStart = ["8:00", "8:55", "9:50", "10:45", "11:40", "12:35", "13:30", "14:25", "15:20", "16:15", "17:10", "18:05"];
    // Get the period within the day
    let periodStart = timesStart.findIndex(t => t == c.classStart);

    // Initialize the periods, time end
    let timesEnd = ["8:50", "9:45", "10:40", "11:35", "12:30", "13:25", "14:20", "15:15", "16:10", "17:05", "18:00", "18:55"];
    // Get the period within the day
    let periodEnd = timesEnd.findIndex(t => t == c.classEnd);

    // Now that we have the start and end, determine ALL periods for the course
    let periods: number[] = [];
    for (let i = periodStart; i <= periodEnd; i++) {
      periods.push(day + i);
    }

    return periods;
  }

}