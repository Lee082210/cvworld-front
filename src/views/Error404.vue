<template>
  <div class="container">
    <h2>Oops! Page not found.</h2>
    <h1>404</h1>
    <h4>We can't find the page you're  looking for.</h4>
    <div><router-link to="/" class="a-link">返回首页</router-link></div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" >

.container{
  width: 100%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
  color: #343434;
  font-family: "montserrat", sans-serif;
  min-height: 100vh;
  background-image: linear-gradient(125deg, #6a89cc, #b8e994);
  h1{
    font-size: 160px;
    margin: 0px;
    font-weight: 900;
    letter-spacing: 20px;
    background: url(../assets/images/bg_xiaolu3.jpg) center no-repeat;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    -webkit-background-clip: text;
  }
  div{
    background: #f0d0cbaa;
    color: #fff;
    padding: 12px 24px;
    display: inline-block;
    border-radius: 25px;
    font-size: 14px;
    text-transform: uppercase;
  }
  div:hover{
    background: #76b4ee;
  }
}
</style>