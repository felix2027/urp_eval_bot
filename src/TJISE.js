// ==UserScript==
// @name         TJISE urp教务系统自动评教脚本
// @namespace    https://greasyfork.org/zh-CN/users/
// @version      1.0
// @description  自动化五星评教
// @author       joey
// @match        https://surp-443.webvpn.tjise.edu.cn/student/teachingEvaluation/newEvaluation/*
// @grant        none
// ==/UserScript==
(function () {
  'use strict';

  // 填写评教内容
  function fillEvaluation() {
    // 填写五星评分
    document.querySelectorAll('.radio-bj').forEach(group => {
      const stars = group.querySelectorAll('.ace-icon.glyphicon-star');
      if (stars.length === 5) {
        stars[4].click();
      }
    });

    // 填写文本框
    document.querySelectorAll('textarea.form-control.value_element').forEach(textarea => {
      textarea.value = '无';
      textarea.dispatchEvent(new Event('change', { bubbles: true }));
    });

    console.log("已完成五星评教填写");
  }

  // 页面逻辑分支
  function main() {
    const url = window.location.href;

    // 如果当前页面是 /evaluation/*
    if (url.includes('/student/teachingEvaluation/newEvaluation/evaluation/')) {
      console.log("检测到评教页面，开始执行评教和计时器逻辑...");

      // 执行五星评教
      fillEvaluation();

      // 定义定时器，每秒执行一次
      const timer = setInterval(() => {
        // 获取 timer 元素
        const timerElement = document.getElementById("timer");

        // 如果找不到 timer 元素，停止检测
        if (!timerElement) {
          console.warn("找不到 #timer 元素，停止检测");
          clearInterval(timer);
          return;
        }

        // 检查文本是否为 "0分00秒"
        if (timerElement.textContent.trim() === "0分00秒") {
          // 获取 savebutton 按钮
          const saveButton = document.getElementById("savebutton");

          // 如果找到按钮，则点击
          if (saveButton) {
            console.log("检测到计时器为 0分00秒，准备点击保存按钮");

            // 创建并触发 click 事件
            const clickEvent = new MouseEvent("click", {
              bubbles: true,
              cancelable: true,
              view: window
            });
            saveButton.dispatchEvent(clickEvent);
            console.log("保存按钮点击事件已触发");

            // 停止定时器
            clearInterval(timer);
          } else {
            console.warn("找不到 #savebutton 按钮");
          }
        }
      }, 1000);
    }

    // 如果当前页面是 /index
    else if (url.includes('/student/teachingEvaluation/newEvaluation/index')) {
      console.log("检测到评教首页，尝试点击指定 Tab 元素...");

      // 使用 XPath 查询指定元素
      function getElementByXPath(xpath) {
        return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      }

      const tabElement = getElementByXPath('//*[@id="myTab"]/li[1]/a');
      if (tabElement) {
        tabElement.click();
        console.log("已点击指定 Tab 元素");
        // 延迟1秒，确保 Tab 切换完成
        setTimeout(() => {
          // 查找评教按钮
          const evaluationButtons = document.querySelectorAll('button[flag="jxpg"]');
          if (evaluationButtons.length > 0) {
            // 点击第一个评教按钮
            evaluationButtons[0].click();
            console.log("已点击评教按钮");
          } else {
            console.warn("找不到评教按钮");
          }
        }, 1000); // 延迟1秒以确保页面加载完毕
      } else {
        console.warn("找不到指定的 Tab 元素");
      }
    }
  }

  // 页面加载完成后执行入口函数
  window.addEventListener('load', main);
})();
