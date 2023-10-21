### Steps to run the project:

> Make sure you have node.js version later then v18.16.1  
> Make sure you have npm version later then 9.5.1

`npm install`  
`npm run build:assets`  
`npm run dev`  

Vite will redirect you to the browser page to view the project locally.


### Difficulties with completing tasks:  
1. For the cards task main difficulty was with figuring out the position where next card should fly to. There can be multiple cards flying to the target deck, each of them need to know position respective to the previous card which is hasn't jet landed.

2. For the tool task it was quite straightforward. Logic for the layout ideally can be done with pixi-layout, but since its the test task figured that better to KISS.

3. For particles tricky thing was to decide to use the previous version of particle configuration since it looks like the docs for the new one are not quite ready yet.

4. Overall challenging thing was to clear the task page resources before switching to next one. Decided to go with keeping the page objects, instead of giving them to garbage collector. Keeping most of the objects reusable makes additional layer of complexity to the application since every page has to manually be destroyed. However, that can yield better performance because less job for GC.