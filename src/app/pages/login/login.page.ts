import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import {
  FacebookLogin,
  FacebookLoginPlugin,
} from "@capacitor-community/facebook-login";
import { Plugins, registerWebPlugin } from "@capacitor/core";
import { isPlatform } from "@ionic/angular";

registerWebPlugin(FacebookLogin);

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  fbLogin: FacebookLoginPlugin;
  user = null;
  token = null;
  constructor(private http: HttpClient) {
    this.setupFbLogin();
  }

  ngOnInit() {}

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
      console.log("User: ", res);
      this.user = res;
    });
  }

  async logout() {
    await this.fbLogin.logout();
    this.user = null;
    this.token = null;
  }
}
