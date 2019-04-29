import { Component, OnInit } from '@angular/core';
import { Student } from "./dataModelClasses";
import { DataModelManagerService } from './data-model-manager.service';


@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})

export class StudentsComponent implements OnInit {

  students: Student[];

  constructor(private m: DataModelManagerService) {}

  ngOnInit() {
    this.m.studentsGetAll().subscribe(p => this.students = p);
  }

}
