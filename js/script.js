"use strict";

function fnMain() {
    // Подключение локальных шрифтов
    const FontsStyleSheet = document.querySelector(`head > link[href*="fonts.googleapis.com"][rel="stylesheet"]`);
    FontsStyleSheet.href = "css/fonts.css";

    const MainBlockLink = document.querySelector(".main-block-link");
    MainBlockLink.textContent = "Infinite Travel";

    Tabs({
        navBlock: ".info-header",
        tabBlock: ".info-header-tab",
        tabBlockClass: "info-header-tab",
        contentBlock: ".info-tabcontent",
        visible: "show",
        hidden: "hide"
    });

    Timer({
        container: "#timer",
        hoursBlock: ".hours",
        minutesBlock: ".minutes",
        secondsBlock: ".seconds",
        deadLine: "18:20:11",
        displayDays: false
    });

    ModalWindow({
        openButton: ".more",
        overlay: ".overlay",
        closeButton: ".popup-close",
        openButtonClickAnimationClass: "more-splash"
    });

    TabsModalWindows({
        contentBlocks: ".info .info-tabcontent",
        openButtons: ".description-btn",
        buttonIdPrefix: "description-btn-",
        overlay: ".overlay",
        closeButtons: ".popup-close",
        openButtonClickAnimationClass: "more-splash"
    });

    Slider({
        container: ".slider",
        slideBlock: ".slider-item",
        prevButton: ".prev",
        nextButton: ".next",
        dotsWrapper: ".slider-dots",
        dotBlock: ".dot",
        activeDotClass: "dot-active"
    });

    HandleForm({
        messages: {
            loading: "Загрузка...",
            success: "Спасибо! Скоро мы с вами свяжемся!",
            failure: "Что-то пошло не так..."
        },
        form: ".main-form",
        formFooter: ".popup-form__label, .popup-form__input, .popup-form__btn",
        statusMessageClass: "status",
        handler: "server.php",
        dataFormat: "json"
    });
}

document.addEventListener("DOMContentLoaded", fnMain);

function Tabs(Settings) {
    const tab = document.querySelectorAll(Settings.tabBlock),
          info = document.querySelector(Settings.navBlock),
          tabContent = document.querySelectorAll(Settings.contentBlock);

    const hideTabContent = (a) => {
        tabContent.forEach((Block, iBlockCounter) => {
            if(iBlockCounter < a) {
                return;
            }
            Block.classList.remove(Settings.visible);
            Block.classList.add(Settings.hidden);
        });
    };

    hideTabContent(1);

    const showTabContent = (b) => {
        if(tabContent[b].classList.contains(Settings.hidden)) {
            tabContent[b].classList.remove(Settings.hidden);
            tabContent[b].classList.add(Settings.visible);
        }
    };

    info.addEventListener("click", (event) => {
        const target = event.target;
        if(target && target.classList.contains(Settings.tabBlockClass)) {
            Array.from(tab).some((Tab, iTabCounter) => {
                if(target == Tab) {
                    hideTabContent(0);
                    showTabContent(iTabCounter);
                    return true;
                }
                return false;
            });
        }
    });
}

function Timer(Settings) {
    const [nHours, nMinutes, nSeconds] = Settings.deadLine.split(':').map(Number);
    const CurrentDate = new Date(),
        TimerDeadline = new Date( CurrentDate.getTime() + (nHours * 60 * 60 * 1000) + (nMinutes * 60 * 1000) + (nSeconds * 1000) ),
        sTimerDeadline = `${TimerDeadline.getFullYear()}-
            ${String(TimerDeadline.getMonth() + 1).padStart(2, '0')}-
            ${String(TimerDeadline.getDate()).padStart(2, '0')} 
            ${String(TimerDeadline.getHours()).padStart(2, '0')}:
            ${String(TimerDeadline.getMinutes()).padStart(2, '0')}:
            ${String(TimerDeadline.getSeconds()).padStart(2, '0')}`;

    const getTimeRemaining = (endtime) => {
        const t = Date.parse(endtime) - Date.parse( new Date() ),
              seconds = Math.floor((t/1000) % 60),
              minutes = Math.floor((t/1000/60) % 60);
        let hours = Math.floor((t/(1000*60*60))),
            days;

        if(Settings.displayDays) {
            hours = Math.floor((t/1000/60/60) % 24);
            days = Math.floor((t/(1000*60*60*24)));
        }

        return {
            "total": t,
            "days": days,
            "hours": hours,
            "minutes": minutes,
            "seconds": seconds
        };
    };

    const setClock = (endtime) => {
        const timer = document.querySelector(Settings.container),
              hours = timer.querySelector(Settings.hoursBlock),
              minutes = timer.querySelector(Settings.minutesBlock),
              seconds = timer.querySelector(Settings.secondsBlock),
              timeInterval = setInterval(updateClock, 1000);
        let days;

        if(Settings.displayDays) {
            days = timer.querySelector(Settings.daysBlock);
        }

        function updateClock() {
            const t = getTimeRemaining(endtime);

            if(t.total <= 0) {
                clearInterval(timeInterval);
                t.total = 0;
                t.days = 0;
                t.hours = 0;
                t.minutes = 0;
                t.seconds = 0;
            }

            hours.textContent = String(t.hours).padStart(2, '0');
            minutes.textContent = String(t.minutes).padStart(2, '0');
            seconds.textContent = String(t.seconds).padStart(2, '0');

            if(Settings.displayDays) {
                days.textContent = String(t.days);
            }
        }
    };

    setClock(sTimerDeadline);
}

function ModalWindow(Settings) {
    const more = document.querySelector(Settings.openButton),
          overlay = document.querySelector(Settings.overlay),
          close = document.querySelector(Settings.closeButton);

    more.addEventListener("click", () => {
        overlay.style.display = "unset";
        if(Settings.openButtonClickAnimationClass) {
            more.classList.add(Settings.openButtonClickAnimationClass);
        }
        document.body.style.overflow = "hidden";
    });

    close.addEventListener("click", () => {
        overlay.style.display = "none";
        if(Settings.openButtonClickAnimationClass) {
            more.classList.remove(Settings.openButtonClickAnimationClass);
        }
        document.body.style.overflow = "unset";
    });
}

function TabsModalWindows(Settings) {
    const TabContentBlocks = document.querySelectorAll(Settings.contentBlocks);
    TabContentBlocks.forEach((TabBlock, iIndexCounter) => {
        const ModalButton = TabBlock.querySelector(Settings.openButtons);
        const sButtonId = `${Settings.buttonIdPrefix}${iIndexCounter + 1}`;
        ModalButton.id = sButtonId;
        ModalWindow({
            openButton: `#${sButtonId}`,
            overlay: Settings.overlay,
            closeButton: Settings.closeButtons,
            openButtonClickAnimationClass: Settings.openButtonClickAnimationClass
        });
    });
}

function Slider(Settings) {
    let slideIndex = 1,
        Container = document.querySelector(Settings.container),
        slides = Container.querySelectorAll(Settings.slideBlock),
        prev = Container.querySelector(Settings.prevButton),
        next = Container.querySelector(Settings.nextButton),
        dotsWrap = Container.querySelector(Settings.dotsWrapper),
        dots = dotsWrap.querySelectorAll(Settings.dotBlock);

    showSlides(slideIndex);

    function showSlides(n) {
        if(n > slides.length) {
            slideIndex = 1;
        }
        if(n < 1) {
            slideIndex = slides.length;
        }

        slides.forEach((item) => item.style.display = "none");
        dots.forEach((item) => item.classList.remove(Settings.activeDotClass));

        slides[slideIndex - 1].style.display = "unset";
        dots[slideIndex - 1].classList.add(Settings.activeDotClass);
    }

    function plusSlides(n) {
        showSlides(slideIndex += n);
    }

    function currentSlide(n) {
        showSlides(slideIndex = n);
    }

    prev.addEventListener("click", function() {
        plusSlides(-1);
    });

    next.addEventListener("click", function() {
        plusSlides(1);
    });

    dotsWrap.addEventListener("click", (EventObject) => {
        dots.forEach((DotBlock, nIndex) => {
            if(EventObject.target == DotBlock) {
                currentSlide(nIndex + 1);
            }
        });
    });
}

function HandleForm(Settings) {
    let message = Settings.messages;

    let form = document.querySelector(Settings.form),
        input = form.getElementsByTagName("input"),
        FormFooter = form.querySelectorAll(Settings.formFooter),
        statusMessage = document.createElement("div");

    statusMessage.classList.add(Settings.statusMessageClass);

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        form.append(statusMessage);

        const HttpStatus = {
            OK: 200,
            NOT_MODIFIED: 304
        };
        let request = new XMLHttpRequest();
        request.open("POST", Settings.handler);

        let formData = new FormData(form);

        let sRequestBody;
        if(Settings.dataFormat == "urlencode") {
            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            sRequestBody = "";
            for(let [sName, sValue] of formData) {
                sRequestBody += `${sName}=${encodeURIComponent(sValue)}&`;
            }
            request.send(sRequestBody.slice(0, -1));
        }
        if(Settings.dataFormat == "json") {
            request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            let obj = {};
            formData.forEach(function(value, key) {
                obj[key] = value;
            });
            sRequestBody = JSON.stringify(obj);
            request.send(sRequestBody);
        }

        FormFooter.forEach((Block) => {
            Block.style.display = "none";
        });
        statusMessage.textContent = message.loading;

        request.addEventListener("readystatechange", function() {
            if(request.readyState < XMLHttpRequest.DONE) {
                statusMessage.textContent = message.loading;
            }
            else if(request.readyState === XMLHttpRequest.DONE) {
                if(request.status == HttpStatus.OK || request.status == HttpStatus.NOT_MODIFIED) {
                    FormFooter.forEach((Block) => {
                        Block.remove();
                    });
                    statusMessage.textContent = message.success;
                }
                else {
                    FormFooter.forEach((Block) => {
                        Block.style.display = "unset";
                    });
                    statusMessage.textContent = message.failure;
                }
            }
        });

        for(let i = 0; i < input.length; i++) {
            input[i].value = "";
        }
    });
}