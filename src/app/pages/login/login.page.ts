import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  FacebookLogin,
  FacebookLoginPlugin,
} from "@capacitor-community/facebook-login";
import { Plugins, registerWebPlugin } from "@capacitor/core";
import { isPlatform } from "@ionic/angular";
import { AppComponent } from "src/app/app.component";

registerWebPlugin(FacebookLogin);

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage {
  fbLogin: FacebookLoginPlugin;
  user = null;
  token = null;
  constructor(
    private appComponent: AppComponent,
    private http: HttpClient,
    private router: Router
  ) {
    this.setupFbLogin();
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

  async login() {
    const FACEBOOK_PERMISSIONS = ["email", "user_birthday"];
    const result = await this.fbLogin.login({
      permissions: FACEBOOK_PERMISSIONS,
    });

    if (result.accessToken && result.accessToken.userId) {
      this.token = result.accessToken;
      this.loadUserData();
    } else if (result.accessToken && !result.accessToken.userId) {
      // Web only gets the token but not the user ID
      // Directly call get token to retrieve it now
      this.getCurrentToken();
    } else {
      // Login failed
      return;
    }
  }

  async getCurrentToken() {
    const result = await this.fbLogin.getCurrentAccessToken();

    if (result.accessToken) {
      this.token = result.accessToken;
      this.loadUserData();
    } else {
      // Not logged in.
    }
  }

  async loadUserData() {
    const url = `https://graph.facebook.com/${this.token.userId}?fields=id,name,picture.width(720),birthday,email&access_token=${this.token.token}`;
    this.http.get(url).subscribe((res) => {
      this.appComponent.user = res;
      this.token
      // Will only reach here if login succeeded
      this.router.navigate(["/tabs/tab1"], {
        queryParams: { userData: JSON.stringify(this.user) },
      });
    });
  }
}
