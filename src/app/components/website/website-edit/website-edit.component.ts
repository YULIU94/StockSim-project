import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service.client';
import { User } from '../../../models/user.model.client';
import { Router } from '@angular/router';
import { WebsiteService} from '../../../services/website.service.client';
import { NgForm } from '@angular/forms';
import { Website} from '../../../models/website.model.client';
import { ViewChild } from '@angular/core';
import {SharedService} from '../../../services/shared.service.client';
import { QuillEditorModule } from 'ngx-quill-editor';

@Component({
  selector: 'app-website-edit',
  templateUrl: './website-edit.component.html',
  styleUrls: ['./website-edit.component.css']
})
export class WebsiteEditComponent implements OnInit {

  @ViewChild('f') updateForm: NgForm;

  wid: String;
  userId: String;
  user: any;
  name: String;
  developerId: String;
  websites: Website[];
  description: String;
  website: Website;
  websitename: String;

  // inject route info in constructor
  constructor(
    private websiteService: WebsiteService,
    private route: ActivatedRoute,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sharedService: SharedService,
    private userService: UserService) { }

    getUser() {
      // this.user = JSON.parse(localStorage.getItem("user"));
      this.user = this.sharedService.user;
      this.userId = this.user['_id'];
    }

    update() {
      if (this.user.role === 'Student') {
        alert ('Students cannot modify class information.');
      } else {
        console.log();
        if (!this.website.name) {
          alert('Please input webiste name');
        } else {
          const newWebsite: Website = {
            _id: this.wid,
            name: this.website.name,
            developerId: this.userId,
            description: this.website.description,
          };
          this.websiteService.updateWebsite(this.wid, newWebsite)
            .subscribe((status) => {
              this.router.navigate(['user', 'website']);
              console.log(status);
            });
        }null
      }
    }

    joinClass() {
     if (this.user.class !== null) {
       alert('You are currently enrolled in an investment class. You can only enroll one each semester.');
     } else {
       const updatedUser = {
         _id: this.userId,
         username: this.user.username,
         password: this.user.password,
         firstName: this.user.firstName,
         lastName: this.user.lastName,
         email: this.user.email,
         class: this.wid
       };

       console.log(updatedUser);

       this.userService.updateUser(this.userId, updatedUser).subscribe((newuser) => {
         // console.log(status);
         this.user = newuser;
         console.log(this.user);
         alert('Welcome to class "' + this.website.name + '"');
       });
     }
    }

    dropClass() {
      if (this.user.class === '') {
        alert ('You are currently not enrolled in any class.');
      } else {
        const updatedUser = {
          _id: this.userId,
          username: this.user.username,
          password: this.user.password,
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          email: this.user.email,
          class: ''
        };

        console.log(updatedUser);

        this.userService.updateUser(this.userId, updatedUser).subscribe((newuser) => {
          // console.log(status);
          this.user = newuser;
          console.log(this.user);
          alert('You have dropped class' + this.website.name);
          this.router.navigate(['user', 'website']);
        });
      }
    }


    goToMyPortfolio() {
      if ( (this.user.role !== 'STUDENT') || (this.user.class === this.website._id)) {
        this.router.navigate(['user', 'website', this.wid, 'page']);
      } else {
        alert ('Student may only check portfolios of its own class.');
      }
    }

    deleteWebsite() {
      if (this.user.role === 'STUDENT') {
        alert ('Student cannot delete classes!');
      } else {
        this.websiteService.deleteWebsite(this.userId, this.wid)
          .subscribe((websites: any) => {
            this.router.navigate(['user', 'website']);
          });
      }
    }

  // notify the changes of the route
  ngOnInit() {
    // invoke a function that can pass the value of the parameters
    this.route.params.subscribe((params: any) => {
      this.wid = params['wid'];
    });

    this.getUser();

    this.user = this.sharedService.user;

    this.userId = this.user['_id'];

    // this.websiteService.findWebsitesByUser(this.userId)
    //   .subscribe((websites) => {
    //     this.websites = websites;
    //   });

    this.websiteService.findAllClasses()
      .subscribe((classes) => {
        this.websites = classes;
        console.log(classes);
      });

    this.websiteService.findWebsiteById(this.userId, this.wid)
      .subscribe((website) => {
        this.website = website;
      });

    this.userService.findUserById(this.userId).subscribe((user: User) => {
      this.user = user;
      console.log(this.user);
    });
  }
}
