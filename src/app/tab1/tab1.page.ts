import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  FacebookLogin,
  FacebookLoginPlugin,
} from "@capacitor-community/facebook-login";
import { Plugins } from "@capacitor/core";
import { isPlatform } from "@ionic/angular";
import { AppComponent } from "../app.component";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
})
export class Tab1Page {
  fbLogin: FacebookLoginPlugin;

  user: null;
  token: null;

  constructor(
    private appComponent: AppComponent,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.setupFbLogin();
    activatedRoute.queryParamMap.subscribe((params) => {
      this.user = params["userData"];
    });
  }

  async setupFbLogin() {
    if (isPlatform("desktop")) {
      this.fbLogin = FacebookLogin;
    } else {
      // Use the native implementation inside a real app!
      const { FacebookLogin } = Plugins;
      this.fbLogin = FacebookLogin;
    }
  }

  async logout() {
    this.router.navigateByUrl("/login");
  }
}
