import { Component, OnInit } from '@angular/core';
import { Course } from "./dataModelClasses";
import { DataModelManagerService } from './data-model-manager.service';

@Component({
  selector: 'app-availablecourses',
  templateUrl: './availablecourses.component.html',
  styleUrls: ['./availablecourses.component.css']
})

export class AvailablecoursesComponent implements OnInit {
  
  courses: Course[];
  
  constructor(private m: DataModelManagerService) {}

  ngOnInit() {
    this.m.coursesGetAll().subscribe(c => this.courses = c);
  }
}
