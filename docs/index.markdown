---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: home
---
<style>
.slider {
  width: 300px;
  text-align: center;
  overflow: hidden;
}

.slides {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  
}
.slides::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.slides::-webkit-scrollbar-thumb {
  background: black;
  border-radius: 10px;
}
.slides::-webkit-scrollbar-track {
  background: transparent;
}
.slides > div {
  scroll-snap-align: start;
  flex-shrink: 0;
  width: 400px;
  height: 400px;
  margin-right: 50px;
  border-radius: 10px;
  background: #eee;
  transform-origin: center center;
  transform: scale(1);
  transition: transform 0.5s;
  position: relative;
  
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 100px;
}
.slides > div:target {
/*   transform: scale(0.8); */
}
.author-info {
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 0.75rem;
  text-align: center;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  margin: 0;
}
.author-info a {
  color: white;
}
img {
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.slider > a {
  display: inline-flex;
  width: 1.5rem;
  height: 1.5rem;
  background: white;
  text-decoration: none;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin: 0 0 0.5rem 0;
  position: relative;
}
.slider > a:active {
  top: 1px;
}
.slider > a:focus {
  background: #000;
}

/* Don't need button navigation */
@supports (scroll-snap-type) {
  .slider > a {
    display: none;
  }
}
</style>

<center>
<p style="margin-top:4rem;">
<img alt="Milford Public Library Horror Movie Night" src="/assets/Feb27.png">
<p style="font-size: 1.5rem;">No tickets necessary. Just show up at the Milford Public Library Program Room</p>


<p style="margin-top:4rem;">
  <span style="font-size: 2rem;">Past Events</span>
  <div class="slider">
  <a href="#slide-1">1</a>
  <a href="#slide-2">2</a>
  <a href="#slide-3">3</a>
  <a href="#slide-4">4</a>

  <div class="slides">
    <div id="slide-1">
      <img src="/assets/past1.jpg">
    </div>
    <div id="slide-2">
      <img src="/assets/past2.jpg">
    </div>
    <div id="slide-3">
      <img src="/assets/past3.jpg">
    </div>
    <div id="slide-4">
      <img src="/assets/past4.jpg">
    </div>
  </div>
</div>
  
