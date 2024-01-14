<script setup lang="ts">
import { DestylerOnline } from 'destyler'

const status = ref<boolean>(false)

function handleStatusChange(value: boolean) {
  status.value = value
}
</script>

<template>
  <DestylerOnline class="content " @network-status="handleStatusChange">
    <div v-if="status" class="content__container">
      <p class="content__container__text ml-2">
        You're
      </p>
      <ul class="content__container__list">
        <li class="content__container__list__item">
          online!
        </li> <li class="content__container__list__item">
          dope!
        </li> <li class="content__container__list__item">
          sweet!
        </li> <li class="content__container__list__item">
          nice!
        </li>
      </ul>
    </div>
    <div v-else class="content-offline">
      <div class="content-offline__container">
        <p data-text="You're" class="content__container__text glitch">
          You're
        </p> <ul class="content__container__list">
          <li data-text="offline!" class="content__container__list__item glitch">
            offline!
          </li> <li data-text="offline!" class="content__container__list__item glitch">
            offline!
          </li> <li data-text="offline!" class="content__container__list__item glitch">
            offline!
          </li> <li data-text="offline!" class="content__container__list__item glitch">
            offline!
          </li>
        </ul>
      </div>
    </div>
  </DestylerOnline>
</template>

<style scoped>
.content {
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
    overflow: hidden;
    font-family: Lato,sans-serif;
    font-size: 35px;
    line-height: 40px;
    color: #18181B
}
.dark .content {
    color: #FAFAFA
}

.content__container {
    font-weight: 700;
    overflow: hidden;
    height: 40px;
    padding: 0 40px
}

.content__container:before {
    content: "[";
    left: 0
}

.content__container:after {
    content: "]";
    position: absolute;
    right: 0
}

.content__container:after,.content__container:before {
    position: absolute;
    top: 0;
    color: #16a085;
    font-size: 42px;
    line-height: 40px;
    -webkit-animation-name: opacity;
    -webkit-animation-duration: 2s;
    -webkit-animation-iteration-count: infinite;
    animation-name: opacity;
    animation-duration: 2s;
    animation-iteration-count: infinite
}

.content__container__text {
    display: inline;
    float: left;
    margin: 0
}

.content__container__list {
    margin-top: 0;
    padding-left: 110px;
    text-align: left;
    list-style: none;
    -webkit-animation-name: change;
    -webkit-animation-duration: 10s;
    -webkit-animation-iteration-count: infinite;
    animation-name: change;
    animation-duration: 10s;
    animation-iteration-count: infinite
}

.content__container__list__item {
    line-height: 40px;
    margin: 0
}

.content-offline {
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
    overflow: hidden;
    font-family: Lato,sans-serif;
    font-size: 35px;
    line-height: 40px;
    color: #ecf0f1
}

.content-offline__container {
    font-weight: 700;
    overflow: hidden;
    height: 40px;
    padding: 0 40px
}

.content-offline__container:before {
    content: "[";
    left: 0
}

.content-offline__container:after {
    content: "]";
    position: absolute;
    right: 0
}

.content-offline__container:after,.content-offline__container:before {
    position: absolute;
    top: 0;
    color: red;
    font-size: 42px;
    line-height: 40px;
    -webkit-animation-name: opacity;
    -webkit-animation-duration: 2s;
    -webkit-animation-iteration-count: infinite;
    animation-name: opacity;
    animation-duration: 2s;
    animation-iteration-count: infinite
}

.content-offline__container__text {
    display: inline;
    float: left;
    margin: 0
}

.content-offline__container__list {
    margin-top: 0;
    padding-left: 110px;
    text-align: left;
    list-style: none;
    -webkit-animation-name: change;
    -webkit-animation-duration: 10s;
    -webkit-animation-iteration-count: infinite;
    animation-name: change;
    animation-duration: 10s;
    animation-iteration-count: infinite
}

.content-offline__container__list__item {
    line-height: 40px;
    margin: 0
}

.glitch {
    color: #FAFAFA;
    position: relative;
    margin: 0 auto
}

@-webkit-keyframes noise-anim {
    0% {
        clip: rect(38px,9999px,1px,0)
    }

    5% {
        clip: rect(52px,9999px,88px,0)
    }

    10% {
        clip: rect(79px,9999px,26px,0)
    }

    15% {
        clip: rect(74px,9999px,3px,0)
    }

    20% {
        clip: rect(5px,9999px,33px,0)
    }

    25% {
        clip: rect(66px,9999px,25px,0)
    }

    30% {
        clip: rect(34px,9999px,42px,0)
    }

    35% {
        clip: rect(55px,9999px,44px,0)
    }

    40% {
        clip: rect(66px,9999px,83px,0)
    }

    45% {
        clip: rect(96px,9999px,92px,0)
    }

    50% {
        clip: rect(37px,9999px,36px,0)
    }

    55% {
        clip: rect(23px,9999px,48px,0)
    }

    60% {
        clip: rect(87px,9999px,34px,0)
    }

    65% {
        clip: rect(53px,9999px,11px,0)
    }

    70% {
        clip: rect(44px,9999px,73px,0)
    }

    75% {
        clip: rect(5px,9999px,38px,0)
    }

    80% {
        clip: rect(18px,9999px,59px,0)
    }

    85% {
        clip: rect(46px,9999px,81px,0)
    }

    90% {
        clip: rect(32px,9999px,33px,0)
    }

    95% {
        clip: rect(34px,9999px,7px,0)
    }

    to {
        clip: rect(9px,9999px,61px,0)
    }
}

@keyframes noise-anim {
    0% {
        clip: rect(38px,9999px,1px,0)
    }

    5% {
        clip: rect(52px,9999px,88px,0)
    }

    10% {
        clip: rect(79px,9999px,26px,0)
    }

    15% {
        clip: rect(74px,9999px,3px,0)
    }

    20% {
        clip: rect(5px,9999px,33px,0)
    }

    25% {
        clip: rect(66px,9999px,25px,0)
    }

    30% {
        clip: rect(34px,9999px,42px,0)
    }

    35% {
        clip: rect(55px,9999px,44px,0)
    }

    40% {
        clip: rect(66px,9999px,83px,0)
    }

    45% {
        clip: rect(96px,9999px,92px,0)
    }

    50% {
        clip: rect(37px,9999px,36px,0)
    }

    55% {
        clip: rect(23px,9999px,48px,0)
    }

    60% {
        clip: rect(87px,9999px,34px,0)
    }

    65% {
        clip: rect(53px,9999px,11px,0)
    }

    70% {
        clip: rect(44px,9999px,73px,0)
    }

    75% {
        clip: rect(5px,9999px,38px,0)
    }

    80% {
        clip: rect(18px,9999px,59px,0)
    }

    85% {
        clip: rect(46px,9999px,81px,0)
    }

    90% {
        clip: rect(32px,9999px,33px,0)
    }

    95% {
        clip: rect(34px,9999px,7px,0)
    }

    to {
        clip: rect(9px,9999px,61px,0)
    }
}

.glitch:after {
    content: attr(data-text);
    position: absolute;
    left: 2px;
    text-shadow: -1px 0 red;
    top: 0;
    color: #fff;
    background: #34495e;
    overflow: hidden;
    clip: rect(0,900px,0,0);
    animation: noise-anim 2s infinite linear alternate-reverse
}

@-webkit-keyframes noise-anim-2 {
    0% {
        clip: rect(22px,9999px,62px,0)
    }

    5% {
        clip: rect(54px,9999px,80px,0)
    }

    10% {
        clip: rect(90px,9999px,57px,0)
    }

    15% {
        clip: rect(25px,9999px,23px,0)
    }

    20% {
        clip: rect(48px,9999px,100px,0)
    }

    25% {
        clip: rect(99px,9999px,72px,0)
    }

    30% {
        clip: rect(58px,9999px,74px,0)
    }

    35% {
        clip: rect(94px,9999px,29px,0)
    }

    40% {
        clip: rect(43px,9999px,97px,0)
    }

    45% {
        clip: rect(46px,9999px,95px,0)
    }

    50% {
        clip: rect(50px,9999px,56px,0)
    }

    55% {
        clip: rect(3px,9999px,75px,0)
    }

    60% {
        clip: rect(60px,9999px,25px,0)
    }

    65% {
        clip: rect(67px,9999px,38px,0)
    }

    70% {
        clip: rect(69px,9999px,94px,0)
    }

    75% {
        clip: rect(35px,9999px,4px,0)
    }

    80% {
        clip: rect(89px,9999px,28px,0)
    }

    85% {
        clip: rect(34px,9999px,83px,0)
    }

    90% {
        clip: rect(9px,9999px,90px,0)
    }

    95% {
        clip: rect(60px,9999px,17px,0)
    }

    to {
        clip: rect(92px,9999px,15px,0)
    }
}

@keyframes noise-anim-2 {
    0% {
        clip: rect(22px,9999px,62px,0)
    }

    5% {
        clip: rect(54px,9999px,80px,0)
    }

    10% {
        clip: rect(90px,9999px,57px,0)
    }

    15% {
        clip: rect(25px,9999px,23px,0)
    }

    20% {
        clip: rect(48px,9999px,100px,0)
    }

    25% {
        clip: rect(99px,9999px,72px,0)
    }

    30% {
        clip: rect(58px,9999px,74px,0)
    }

    35% {
        clip: rect(94px,9999px,29px,0)
    }

    40% {
        clip: rect(43px,9999px,97px,0)
    }

    45% {
        clip: rect(46px,9999px,95px,0)
    }

    50% {
        clip: rect(50px,9999px,56px,0)
    }

    55% {
        clip: rect(3px,9999px,75px,0)
    }

    60% {
        clip: rect(60px,9999px,25px,0)
    }

    65% {
        clip: rect(67px,9999px,38px,0)
    }

    70% {
        clip: rect(69px,9999px,94px,0)
    }

    75% {
        clip: rect(35px,9999px,4px,0)
    }

    80% {
        clip: rect(89px,9999px,28px,0)
    }

    85% {
        clip: rect(34px,9999px,83px,0)
    }

    90% {
        clip: rect(9px,9999px,90px,0)
    }

    95% {
        clip: rect(60px,9999px,17px,0)
    }

    to {
        clip: rect(92px,9999px,15px,0)
    }
}

.glitch:before {
    content: attr(data-text);
    position: absolute;
    left: -2px;
    text-shadow: 1px 0 blue;
    top: 0;
    color: #fff;
    background: #34495e;
    overflow: hidden;
    clip: rect(0,900px,0,0);
    animation: noise-anim-2 3s infinite linear alternate-reverse
}

@-webkit-keyframes opacity {
    0%,to {
        opacity: 0
    }

    50% {
        opacity: 1
    }
}

@-webkit-keyframes change {
    0%,12.66%,to {
        -webkit-transform: translateZ(0);
        transform: translateZ(0)
    }

    16.66%,29.32% {
        -webkit-transform: translate3d(0,-25%,0);
        transform: translate3d(0,-25%,0)
    }

    33.32%,45.98% {
        -webkit-transform: translate3d(0,-50%,0);
        transform: translate3d(0,-50%,0)
    }

    49.98%,62.64% {
        -webkit-transform: translate3d(0,-75%,0);
        transform: translate3d(0,-75%,0)
    }

    66.64%,79.3% {
        -webkit-transform: translate3d(0,-50%,0);
        transform: translate3d(0,-50%,0)
    }

    83.3%,95.96% {
        -webkit-transform: translate3d(0,-25%,0);
        transform: translate3d(0,-25%,0)
    }
}

@keyframes opacity {
    0%,to {
        opacity: 0
    }

    50% {
        opacity: 1
    }
}

@keyframes change {
    0%,12.66%,to {
        -webkit-transform: translateZ(0);
        transform: translateZ(0)
    }

    16.66%,29.32% {
        -webkit-transform: translate3d(0,-25%,0);
        transform: translate3d(0,-25%,0)
    }

    33.32%,45.98% {
        -webkit-transform: translate3d(0,-50%,0);
        transform: translate3d(0,-50%,0)
    }

    49.98%,62.64% {
        -webkit-transform: translate3d(0,-75%,0);
        transform: translate3d(0,-75%,0)
    }

    66.64%,79.3% {
        -webkit-transform: translate3d(0,-50%,0);
        transform: translate3d(0,-50%,0)
    }

    83.3%,95.96% {
        -webkit-transform: translate3d(0,-25%,0);
        transform: translate3d(0,-25%,0)
    }
}
</style>
