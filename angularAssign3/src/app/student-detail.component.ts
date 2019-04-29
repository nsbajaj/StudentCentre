import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Student, Course } from "./dataModelClasses";
import { DataModelManagerService } from './data-model-manager.service';

@Component({
  selector: 'app-student-detail',
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.css']
})

export class StudentDetailComponent implements OnInit {
  
  id: string = null;
  student: Student = null;
  coursesSaved: Course[] = [];
  coursesConfirmed: Course[] = [];

  constructor(private route: ActivatedRoute, private m: DataModelManagerService) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");
    // this.m.studentGetById(this.id).subscribe(p => { 
    //   this.student = p;
    //   this.m.setCurrentStudent(this.student);
    // });
    //if(!this.student){
      this.m.studentGetByUsername(this.id).subscribe(e => {
        this.student = e;
        this.m.setCurrentStudent(this.student);
      });
    //}    
  }
}
