import { defineCustomElements } from "@ionic/core/loader";
import { html } from "@arrow-js/core";
import '@ionic/core/css/core.css';

// register custom ionic html elements
defineCustomElements();

// getting app element
const app = document.getElementById('app');

// checking for app to exist
if (!app){
  throw new Error('Element app not found');
}

// create template
const template = html `<ion-button>Test</ion-button>`;

// hydrate app
template(app);
