var periodTimes = [];
var ifMenuOpen = false;
var ifEventsMenuOpen = false;
var ifInfoMenuOpen = false;
var periodNumber;
var currentPeriod;
var savePeriod;
var completeThis;
var completeNext;
var completeLater;
var completeGeneral1;
var completeGeneral2;
var generalEvents;
var laterEvents;

/* period events arrays */
var period1 = [];
var period2 = [];
var period3 = [];
var period4 = [];
var period5 = [];
var period6 = [];
var period7 = [];
var period8 = [];
var period9 = [];
var period10 = [];
var period11 = [];
var period12 = [];
var period13 = [];
var period14 = [];
var period15 = [];
var period16 = [];
var period17 = [];
var period18 = [];
var period19 = [];
var period20 = [];
var general = [];
var lengths = [];
var periods = [];

function start() {
    // removes delay caused by setInterval()
    repeat();
    setInterval(repeat, 1000);
    settings();
}

// removes the corresponding card if button is pressed in the this period section
function removeThis(id) {
    document.getElementById(id).addEventListener("click", function() {
        (document.getElementById(id).parentElement).remove();
        var spliceStart;
        var slashIndex;
        slashIndex = id.indexOf("/");
        spliceStart = parseInt(id.slice(slashIndex + 1))
        if (lengths[currentPeriod] == 1) {
            document.getElementById("this-period").remove();
        }
        periods[currentPeriod].splice(spliceStart, 1);

    });
}

// removes the corresponding card if button is pressed in the next period section
function removeNext(id) {
    document.getElementById(id).addEventListener("click", function() {
        (document.getElementById(id).parentElement).remove();
        var spliceStart;
        var slashIndex;
        slashIndex = id.indexOf("/");
        spliceStart = parseInt(id.slice(slashIndex + 1))
        if (lengths[savePeriod + 1] == 1) {
            document.getElementById("next-period").remove();
        }
        periods[savePeriod + 1].splice(spliceStart, 1);
    });
}

// removes the corresponding card if button is pressed in the later today section
function removeLater(id) {
    document.getElementById(id).addEventListener("click", function() {
        (document.getElementById(id).parentElement).remove();
        var spliceStart;
        var slashIndex;
        var per;
        slashIndex = id.indexOf("/");
        per = parseInt(id.slice(0, slashIndex))
        spliceStart = parseInt(id.slice(slashIndex + 1))
        if (laterEvents == 1) {
            document.getElementById("later-period").remove();
        }
        periods[per].splice(spliceStart, 1);
        laterEvents--;
    });
}

// removes the corresponding card if button is pressed in the general section for the future events
function removeGeneral1(id) {
    document.getElementById(id).addEventListener("click", function() {
        (document.getElementById(id).parentElement).remove();
        var spliceStart;
        var slashIndex;
        var per;
        slashIndex = id.indexOf("/");
        per = parseInt(id.slice(0, slashIndex))
        spliceStart = parseInt(id.slice(slashIndex + 1))
        if (generalEvents == 1) {
            document.getElementById("general-period").remove();
        }
        periods[per].splice(spliceStart, 1);
        generalEvents--;
    });
}

// removes the corresponding card if button is pressed in the general section for things that are in the general array
function removeGeneral2(id) {
    document.getElementById(id).addEventListener("click", function() {
        const tl = gsap.timeline();
        var newelement = document.getElementById(id);
        
        if (generalEvents == 1) {
            tl.to(newelement, {scale: 0.85});
            tl.to(newelement, {y: 413, opacity: 0, duration: 0.2, ease: "none"});
            tl.to("#general-period", {opacity: 0, duration: 0.2, ease: "none"}, "<");
            tl.call(general2, [id]);
        } else {
            tl.to(newelement, {scale: 0.85});
            tl.to(newelement, {y: 413, opacity: 0, duration: 0.2, ease: "none"});

            var slashdex;
            var num;
            slashdex = id.indexOf("/");
            num = parseInt(id.slice(slashdex + 1));
            for (b = 0; b <= generalEvents + 1; b++) {
                if (b > num) {
                    var idstring;
                    var nextelement;
                    idstring = "0/" + b.toString();
                    nextelement = document.getElementById(idstring);
                    tl.to(nextelement, {x: (-330 * b) + (330 * (b - 1)), rotation: -3, ease: "none", duration: 0.5});
                    tl.to(nextelement, {rotation: 1, duration: 0.3}, ">");
                    tl.to(nextelement, {rotation: 0, duration: 0.1}, ">");
                }
            }
            tl.call(general2, [id]);
        }
    });
}

function general2(name) {
    var spliceStart;
    var slashIndex;
    slashIndex = name.indexOf("/");
    spliceStart = parseInt(name.slice(slashIndex + 1))
    periods[0].splice(spliceStart, 1);
    generalEvents--;
    sectionAdder();
}

function repeat () {
    /*finds out the time of the day*/
    var d = new Date();
    var currentMinutes;
    currentMinutes = (d.getHours() * 60) + d.getMinutes();

    /* checks if the array exists yet or not */
    if (periodTimes.length == 0) {
        document.getElementById("period-number").innerHTML = "Initial Setup";
        document.getElementById("time-left").innerHTML = "Configure settings before first use!";
    } else {

        if (currentMinutes < periodTimes[0]) {
            document.getElementById("period-number").innerHTML = "Before School";
            document.getElementById("time-left").innerHTML = "Have a good day!";
            currentPeriod = 0;
        } else if (currentMinutes > periodTimes[periodTimes.length - 1]) {
            document.getElementById("period-number").innerHTML = "After School";
            document.getElementById("time-left").innerHTML = "School's done!";
            currentPeriod = 0;

        } else {
            // set the period number on screen and how much time is left
            for (x = 0; x < periodTimes.length; x++) {
                if (currentMinutes == periodTimes[x]) {
                    if (x % 2 == 0) {
                        document.getElementById("period-number").innerHTML = "Period " + ((x + 2) / 2).toString();
                        currentPeriod = ((x + 2) / 2);
                        savePeriod = currentPeriod;
                        var perLength;
                        perLength = parseInt(document.getElementById("input2").value);
                        document.getElementById("time-left").innerHTML = "Ends in " + perLength + " minutes";
                        break;
                    } else if (x % 2 == 1) {
                        document.getElementById("period-number").innerHTML = "Between " + ((x + 1) / 2).toString() + " & " + (((x + 1) / 2) + 1).toString();
                        currentPeriod = null;
                        var offLength;
                        offLength = parseInt(document.getElementById("input3").value);
                        document.getElementById("time-left").innerHTML = "Next period starts in " + offLength + " minutes";
                        break;
                    }
                } else if (currentMinutes > periodTimes[x]) {
                    if (currentMinutes < periodTimes[x + 1]) {
                        if (x % 2 == 0) {
                            document.getElementById("period-number").innerHTML = "Period " + ((x + 2) / 2).toString();
                            currentPeriod = ((x + 2) / 2);
                            savePeriod = currentPeriod;
                            document.getElementById("time-left").innerHTML = "Ends in " + (periodTimes[x + 1] - currentMinutes).toString() + " minutes";
                            break;
                        } else if (x % 2 == 1) {
                            document.getElementById("period-number").innerHTML = "Between " + ((x + 1) / 2).toString() + " & " + (((x + 1) / 2) + 1).toString();
                            currentPeriod = null;
                            document.getElementById("time-left").innerHTML = "Next period starts in " + (periodTimes[x + 1] - currentMinutes).toString() + " minutes";
                            break;
                        }
                    }
                }
            }
        }
    }
}
 
function sectionAdder() {
    generalEvents = 0;
    laterEvents = 0;
    /* remove all of the sections first */
    var parent = document.getElementById("main-container");
    while (parent.hasChildNodes()) {
        parent.removeChild(parent.firstChild);
    }
    /* add the sections of event cards to the screen */ 
    /* creating an array for the lengths of the period event arrays for easier referencing*/
    lengths = [general.length, period1.length, period2.length, period3.length, period4.length,
    period5.length, period6.length, period7.length, period8.length, period9.length, 
    period10.length, period11.length, period12.length, period13.length, period14.length, 
    period15.length, period16.length, period17.length, period18.length, period19.length, period20.length];
    
    periods = [general, period1, period2, period3, period4, period5, period6, period7, period8, period9, period10,
    period11, period12, period13, period14, period15, period16, period17, period18, period19, period20];
    var zeroes = 0;

    if (periodTimes.length == 0) {
        /* add background image to direct users */
    } else {
        for (c = 0; c < lengths.length - 1; c++) {
            if (lengths[c] == 0) {
                zeroes++;
            }
        }
        /* if there are events this period and they are not all in the future, add this period section and corresponding cards*/
        if (currentPeriod !== null) {
            if (currentPeriod !== 0) {
                var thisPeriodFutures = false;
                var counter1 = 0;
                for (i = 0; i < periods[currentPeriod].length; i++) {
                    var nowDate = new Date();
                    nowDate.setHours(0, 0, 0, 0);
                    var dueDate = periods[currentPeriod][i][2];
                    if (dueDate.getFullYear() !== nowDate.getFullYear() || dueDate.getMonth() !== nowDate.getMonth() || dueDate.getDate() !== nowDate.getDate()) {
                        counter1++;
                    }
                }
                if (counter1 == periods[currentPeriod].length) {
                    thisPeriodFutures = true;
                }
                if (lengths[currentPeriod] !== 0 && thisPeriodFutures == false) {
                    var cardContainer = document.createElement("div");
                    cardContainer.className = "card-container";
    
                    var newDiv = document.createElement("div");
                    newDiv.className = "section";
                    newDiv.id = "this-period";
    
                    var newLabel = document.createElement("label");   
                    newLabel.innerHTML = "This Period";
                    newLabel.className = "title";
                
                    newDiv.appendChild(newLabel);
                    newDiv.appendChild(cardContainer);
                    document.getElementById("main-container").appendChild(newDiv);
    
                    var nowDate = new Date();
                    nowDate.setHours(0, 0, 0, 0);
                
                    for (e = 0; e < lengths[currentPeriod]; e++) {
                        var dueDate = periods[currentPeriod][e][2];
                        if (dueDate.getFullYear() == nowDate.getFullYear() && dueDate.getMonth() == nowDate.getMonth() && dueDate.getDate() == nowDate.getDate()) {
                            var name = document.createElement("label");
                            name.innerHTML = periods[currentPeriod][e][0];
                            name.className = "section-title card-title select-text";
    
                            var due = document.createElement("label");
                            if (periods[currentPeriod][e][3] < 720) {
                                if (periods[currentPeriod][e][3] % 60 < 10) {
                                    due.innerHTML = "Due " + (Math.floor(periods[currentPeriod][e][3] / 60)).toString() + ":0" + (periods[currentPeriod][e][3] % 60).toString() + " AM";
                                } else {
                                    due.innerHTML = "Due " + (Math.floor(periods[currentPeriod][e][3] / 60)).toString() + ":" + (periods[currentPeriod][e][3] % 60).toString() + " AM";
                                }
                            } else {
                                if (periods[currentPeriod][e][3] < 780) {
                                    if (periods[currentPeriod][e][3] % 60 < 10) {
                                        due.innerHTML = "Due " + (Math.floor(periods[currentPeriod][e][3] / 60)).toString() + ":0" + (periods[currentPeriod][e][3] % 60).toString() + " PM";
                                    } else {
                                        due.innerHTML = "Due " + (Math.floor(periods[currentPeriod][e][3] / 60)).toString() + ":" + (periods[currentPeriod][e][3] % 60).toString() + " PM";
                                    }
                                } else {
                                    if (periods[currentPeriod][e][3] % 60 < 10) {
                                        due.innerHTML = "Due " + ((Math.floor(periods[currentPeriod][e][3] / 60)) - 12).toString() + ":0" + (periods[currentPeriod][e][3] % 60).toString() + " PM";
                                    } else {
                                        due.innerHTML = "Due " + ((Math.floor(periods[currentPeriod][e][3] / 60)) - 12).toString() + ":" + (periods[currentPeriod][e][3] % 60).toString() + " PM";
                                    }
                                }
                            }
                            due.className = "small-text card-title select-text";
    
                            var description = document.createElement("label");
                            description.innerHTML = periods[currentPeriod][e][1];
                            description.className = "card-description select-text";
    
                            var contentScroll = document.createElement("div");
                            contentScroll.className = "content-scroll";
    
                            contentScroll.appendChild(name);
                            contentScroll.appendChild(due);
                            contentScroll.appendChild(description);
    
                            completeThis = document.createElement("button");
                            completeThis.className = "rectangle-button";
                            completeThis.id = currentPeriod.toString() + "/" + e.toString();
                            completeThis.innerHTML = "Complete";
    
                            var newCard = document.createElement("div");
                            newCard.className = "card";
                        
                            newCard.appendChild(contentScroll);
                            newCard.appendChild(completeThis);
    
                            cardContainer.appendChild(newCard);
                            removeThis(completeThis.id);
                        }
                    }
                }
            } 
            /* if there are events next period and all are not due in the future, add next period section */
            if (currentPeriod !== 0) {
                var nextPeriodFutures = false;
                var counter2 = 0;
                for (i = 0; i < periods[currentPeriod + 1].length; i++) {
                    var nowDate = new Date();
                    nowDate.setHours(0, 0, 0, 0);
                    var dueDate = periods[currentPeriod + 1][i][2];
                    if (dueDate.getFullYear() !== nowDate.getFullYear() || dueDate.getMonth() !== nowDate.getMonth() || dueDate.getDate() !== nowDate.getDate()) {
                        counter2++;
                    }
                }
                if (counter2 == periods[currentPeriod + 1].length) {
                    nextPeriodFutures = true;
                }
                if (lengths[currentPeriod + 1] !== 0 && nextPeriodFutures == false) {
                    var cardContainer = document.createElement("div");
                    cardContainer.className = "card-container";
    
                    var newDiv = document.createElement("div");
                    newDiv.className = "section";
                    newDiv.id = "next-period";
    
                    var newLabel = document.createElement("label");   
                    newLabel.innerHTML = "Next Period";
                    newLabel.className = "title";
                    
                    newDiv.appendChild(newLabel);
                    newDiv.appendChild(cardContainer);
                    document.getElementById("main-container").appendChild(newDiv);
    
                    var nowDate = new Date();
                    nowDate.setHours(0, 0, 0, 0);
                    
                    for (e = 0; e < lengths[currentPeriod + 1]; e++) {
                        var dueDate = periods[currentPeriod + 1][e][2];
                        if (dueDate.getFullYear() == nowDate.getFullYear() && dueDate.getMonth() == nowDate.getMonth() && dueDate.getDate() == nowDate.getDate()) {
                            var name = document.createElement("label");
                            name.innerHTML = periods[currentPeriod + 1][e][0];
                            name.className = "section-title card-title select-text";
    
                            var due = document.createElement("label");
                            if (periods[currentPeriod + 1][e][3] < 720) {
                                if (periods[currentPeriod + 1][e][3] % 60 < 10) {
                                    due.innerHTML = "Due " + (Math.floor(periods[currentPeriod + 1][e][3] / 60)).toString() + ":0" + (periods[currentPeriod + 1][e][3] % 60).toString() + " AM";
                                } else {
                                    due.innerHTML = "Due " + (Math.floor(periods[currentPeriod + 1][e][3] / 60)).toString() + ":" + (periods[currentPeriod + 1][e][3] % 60).toString() + " AM";
                                }
                            } else {
                                if (periods[currentPeriod + 1][e][3] < 780) {
                                    if (periods[currentPeriod + 1][e][3] % 60 < 10) {
                                        due.innerHTML = "Due " + (Math.floor(periods[currentPeriod + 1][e][3] / 60)).toString() + ":0" + (periods[currentPeriod + 1][e][3] % 60).toString() + " PM";
                                    } else {
                                        due.innerHTML = "Due " + (Math.floor(periods[currentPeriod + 1][e][3] / 60)).toString() + ":" + (periods[currentPeriod + 1][e][3] % 60).toString() + " PM";
                                    }
                                } else {
                                    if (periods[currentPeriod + 1][e][3] % 60 < 10) {
                                        due.innerHTML = "Due " + ((Math.floor(periods[currentPeriod + 1][e][3] / 60)) - 12).toString() + ":0" + (periods[currentPeriod + 1][e][3] % 60).toString() + " PM";
                                    } else {
                                        due.innerHTML = "Due " + ((Math.floor(periods[currentPeriod + 1][e][3] / 60)) - 12).toString() + ":" + (periods[currentPeriod + 1][e][3] % 60).toString() + " PM";
                                    }
                                }
                            }
                            due.className = "small-text card-title select-text";
    
                            var description = document.createElement("label");
                            description.innerHTML = periods[currentPeriod + 1][e][1];
                            description.className = "card-description select-text";
    
                            var contentScroll = document.createElement("div");
                            contentScroll.className = "content-scroll";
    
                            contentScroll.appendChild(name);
                            contentScroll.appendChild(due);
                            contentScroll.appendChild(description);
    
                            completeNext = document.createElement("button");
                            completeNext.className = "rectangle-button";
                            completeNext.id = (currentPeriod + 1).toString() + "/" + e.toString();
                            completeNext.innerHTML = "Complete";
    
                            var newCard = document.createElement("div");
                            newCard.className = "card";
                            
                            newCard.appendChild(contentScroll);
                            newCard.appendChild(completeNext);
    
                            cardContainer.appendChild(newCard);
                            removeNext(completeNext.id);
                        }
                    }
                }
            }
            /* if there are events later in the day and all are not due in the future, add later today section */
            if (currentPeriod !== 0) {
                var bool = false;
                for (d = currentPeriod + 2; d < periodNumber + 1; d++) {
                    if (lengths[d] !== 0) {
                        bool = true;
                        break;
                    }
                }
    
                var laterPeriodFutures = false;
                var counter3 = 0;
                var totalEvents;
                for (j = currentPeriod + 2; j < periodNumber + 1; j++) {
                    for (i = 0; i < periods[j].length; i++) {
                        var nowDate = new Date();
                        nowDate.setHours(0, 0, 0, 0);
                        var dueDate = periods[j][i][2];
                        if (dueDate.getFullYear() !== nowDate.getFullYear() || dueDate.getMonth() !== nowDate.getMonth() || dueDate.getDate() !== nowDate.getDate()) {
                            counter3++;
                        }
                    }
                    totalEvents += periods[j].length;
                }
                if (counter3 == totalEvents) {
                    laterPeriodFutures = true;
                }
                if (bool == true && laterPeriodFutures == false) {
                    var cardContainer = document.createElement("div");
                    cardContainer.className = "card-container";
    
                    var newDiv = document.createElement("div");
                    newDiv.className = "section";
                    newDiv.id = "later-period";
    
                    var newLabel = document.createElement("label");   
                    newLabel.innerHTML = "Later Today";
                    newLabel.className = "title";
                    
                    newDiv.appendChild(newLabel);
                    newDiv.appendChild(cardContainer);
                    document.getElementById("main-container").appendChild(newDiv);
    
                    var nowDate = new Date();
                    nowDate.setHours(0, 0, 0, 0);
    
                    for (f = currentPeriod + 2; f < periodNumber + 1; f++) {
                        for (e = 0; e < lengths[f]; e++) {
                            var dueDate = periods[f][e][2];
                            if (dueDate.getFullYear() == nowDate.getFullYear() && dueDate.getMonth() == nowDate.getMonth() && dueDate.getDate() == nowDate.getDate()) {
                                var name = document.createElement("label");
                                name.innerHTML = periods[f][e][0];
                                name.className = "section-title card-title select-text";
    
                                var due = document.createElement("label");
                                if (periods[f][e][3] < 720) {
                                    if (periods[f][e][3] % 60 < 10) {
                                        due.innerHTML = "Due " + (Math.floor(periods[f][e][3] / 60)).toString() + ":0" + (periods[f][e][3] % 60).toString() + " AM";
                                    } else {
                                        due.innerHTML = "Due " + (Math.floor(periods[f][e][3] / 60)).toString() + ":" + (periods[f][e][3] % 60).toString() + " AM";
                                    }
                                } else {
                                    if (periods[f][e][3] < 780) {
                                        if (periods[f][e][3] % 60 < 10) {
                                            due.innerHTML = "Due " + (Math.floor(periods[f][e][3] / 60)).toString() + ":0" + (periods[f][e][3] % 60).toString() + " PM";
                                        } else {
                                            due.innerHTML = "Due " + (Math.floor(periods[f][e][3] / 60)).toString() + ":" + (periods[f][e][3] % 60).toString() + " PM";
                                        }
                                    } else {
                                        if (periods[f][e][3] % 60 < 10) {
                                            due.innerHTML = "Due " + ((Math.floor(periods[f][e][3] / 60)) - 12).toString() + ":0" + (periods[f][e][3] % 60).toString() + " PM";
                                        } else {
                                            due.innerHTML = "Due " + ((Math.floor(periods[f][e][3] / 60)) - 12).toString() + ":" + (periods[f][e][3] % 60).toString() + " PM";
                                        }
                                    }
                                }
                                due.className = "small-text card-title select-text";
    
                                var description = document.createElement("label");
                                description.innerHTML = periods[f][e][1];
                                description.className = "card-description select-text";
    
                                var contentScroll = document.createElement("div");
                                contentScroll.className = "content-scroll";
    
                                contentScroll.appendChild(name);
                                contentScroll.appendChild(due);
                                contentScroll.appendChild(description);
    
                                completeLater = document.createElement("button");
                                completeLater.className = "rectangle-button";
                                completeLater.id = (f).toString() + "/" + e.toString();
                                completeLater.innerHTML = "Complete";
    
                                var newCard = document.createElement("div");
                                newCard.className = "card";
                                
                                newCard.appendChild(contentScroll);
                                newCard.appendChild(completeLater);
    
                                cardContainer.appendChild(newCard);
                                laterEvents++;
                                removeLater(completeLater.id);
                            }
                        }
                    }
                }
            }
            /* if general events exist or future events in other periods, add general section or events that are due at later dates in other periods */
            var allFutures = false;
            var counter4 = 0;
            for (j = 0; j < periodNumber + 1; j++) {
                for (i = 0; i < periods[j].length; i++) {
                    var nowDate = new Date();
                    nowDate.setHours(0, 0, 0, 0);
                    var dueDate = periods[j][i][2];
                    if (dueDate.getFullYear() !== nowDate.getFullYear() || dueDate.getMonth() !== nowDate.getMonth() || dueDate.getDate() !== nowDate.getDate()) {
                        counter4++;
                    }
                }
            }
            if (counter4 > 0) {
                allFutures = true;
            }
            if (lengths[0] !== 0 || allFutures == true) {
                var cardContainer = document.createElement("div");
                cardContainer.className = "card-container";
    
                var newDiv = document.createElement("div");
                newDiv.className = "section";
                newDiv.id = "general-period";
    
                var newLabel = document.createElement("label");  
                newLabel.innerHTML = "General";
                newLabel.className = "title";
                
                newDiv.appendChild(newLabel);
                newDiv.appendChild(cardContainer);
                document.getElementById("main-container").appendChild(newDiv);
    
                var nowDate = new Date();
                nowDate.setHours(0, 0, 0, 0);
                
                for (f = 1; f < periodNumber + 1; f++) {
                    for (e = 0; e < lengths[f]; e++) {
                        var dueDate = periods[f][e][2];
                        if (dueDate.getFullYear() !== nowDate.getFullYear() || dueDate.getMonth() !== nowDate.getMonth() || dueDate.getDate() !== nowDate.getDate()) {
                            var name = document.createElement("label");
                            name.innerHTML = periods[f][e][0];
                            name.className = "section-title card-title select-text";
    
                            var due = document.createElement("label");
                            if (periods[f][e][3] < 720) {
                                if (periods[f][e][3] % 60 < 10) {
                                    due.innerHTML = "Due " + (dueDate.getMonth() + 1).toString() + "/" + (dueDate.getDate()).toString() + "/" + (dueDate.getFullYear()).toString() + " at " + (Math.floor(periods[f][e][3] / 60)).toString() + ":0" + (periods[f][e][3] % 60).toString() + " AM";
                                } else {
                                    due.innerHTML = "Due " + (dueDate.getMonth() + 1).toString() + "/" + (dueDate.getDate()).toString() + "/" + (dueDate.getFullYear()).toString() + " at " + (Math.floor(periods[f][e][3] / 60)).toString() + ":" + (periods[f][e][3] % 60).toString() + " AM";
                                }
                            } else {
                                if (periods[f][e][3] < 780) {
                                    if (periods[f][e][3] % 60 < 10) {
                                        due.innerHTML = "Due " + (dueDate.getMonth() + 1).toString() + "/" + (dueDate.getDate()).toString() + "/" + (dueDate.getFullYear()).toString() + " at " + (Math.floor(periods[f][e][3] / 60)).toString() + ":0" + (periods[f][e][3] % 60).toString() + " PM";
                                    } else {
                                        due.innerHTML = "Due " + (dueDate.getMonth() + 1).toString() + "/" + (dueDate.getDate()).toString() + "/" + (dueDate.getFullYear()).toString() + " at " + (Math.floor(periods[f][e][3] / 60)).toString() + ":" + (periods[f][e][3] % 60).toString() + " PM";
                                    }
                                } else {
                                    if (periods[f][e][3] % 60 < 10) {
                                        due.innerHTML = "Due " + (dueDate.getMonth() + 1).toString() + "/" + (dueDate.getDate()).toString() + "/" + (dueDate.getFullYear()).toString() + " at " + ((Math.floor(periods[f][e][3] / 60)) - 12).toString() + ":0" + (periods[f][e][3] % 60).toString() + " PM";
                                    } else {
                                        due.innerHTML = "Due " + (dueDate.getMonth() + 1).toString() + "/" + (dueDate.getDate()).toString() + "/" + (dueDate.getFullYear()).toString() + " at " + ((Math.floor(periods[f][e][3] / 60)) - 12).toString() + ":" + (periods[f][e][3] % 60).toString() + " PM";
                                    }
                                }
                            }
                            due.className = "small-text card-title select-text";
    
                            var description = document.createElement("label");
                            description.innerHTML = periods[f][e][1];
                            description.className = "card-description select-text";
    
                            var contentScroll = document.createElement("div");
                            contentScroll.className = "content-scroll";
    
                            contentScroll.appendChild(name);
                            contentScroll.appendChild(due);
                            contentScroll.appendChild(description);
    
                            completeGeneral1 = document.createElement("button");
                            completeGeneral1.className = "rectangle-button";
                            completeGeneral1.id = (f).toString() + "/" + e.toString();
                            completeGeneral1.innerHTML = "Complete";
    
                            var newCard = document.createElement("div");
                            newCard.className = "card";
                            
                            newCard.appendChild(contentScroll);
                            newCard.appendChild(completeGeneral1);
    
                            cardContainer.appendChild(newCard);
                            generalEvents++;
                            removeGeneral1(completeGeneral1.id);
                        }
                    }
                }
    
                for (e = 0; e < lengths[0]; e++) {
                    var dueDate = periods[0][e][2];
                    var name = document.createElement("label");
                    name.innerHTML = periods[0][e][0];
                    name.className = "section-title card-title select-text";
    
                    var due = document.createElement("label");
                    if (periods[0][e][3] < 720) {
                        if (periods[0][e][3] % 60 < 10) {
                            due.innerHTML = "Due " + (dueDate.getMonth() + 1).toString() + "/" + (dueDate.getDate()).toString() + "/" + (dueDate.getFullYear()).toString() + " at " + (Math.floor(periods[0][e][3] / 60)).toString() + ":0" + (periods[0][e][3] % 60).toString() + " AM";
                        } else {
                            due.innerHTML = "Due " + (dueDate.getMonth() + 1).toString() + "/" + (dueDate.getDate()).toString() + "/" + (dueDate.getFullYear()).toString() + " at " + (Math.floor(periods[0][e][3] / 60)).toString() + ":" + (periods[0][e][3] % 60).toString() + " AM";
                        }
                    } else {
                        if (periods[0][e][3] < 780) {
                            if (periods[0][e][3] % 60 < 10) {
                                due.innerHTML = "Due " + (dueDate.getMonth() + 1).toString() + "/" + (dueDate.getDate()).toString() + "/" + (dueDate.getFullYear()).toString() + " at " + (Math.floor(periods[0][e][3] / 60)).toString() + ":0" + (periods[0][e][3] % 60).toString() + " PM";
                            } else {
                                due.innerHTML = "Due " + (dueDate.getMonth() + 1).toString() + "/" + (dueDate.getDate()).toString() + "/" + (dueDate.getFullYear()).toString() + " at " + (Math.floor(periods[0][e][3] / 60)).toString() + ":" + (periods[0][e][3] % 60).toString() + " PM";
                            }
                        } else {
                            if (periods[0][e][3] % 60 < 10) {
                                due.innerHTML = "Due " + (dueDate.getMonth() + 1).toString() + "/" + (dueDate.getDate()).toString() + "/" + (dueDate.getFullYear()).toString() + " at " + ((Math.floor(periods[0][e][3] / 60)) - 12).toString() + ":0" + (periods[0][e][3] % 60).toString() + " PM";
                            } else {
                                due.innerHTML = "Due " + (dueDate.getMonth() + 1).toString() + "/" + (dueDate.getDate()).toString() + "/" + (dueDate.getFullYear()).toString() + " at " + ((Math.floor(periods[0][e][3] / 60)) - 12).toString() + ":" + (periods[0][e][3] % 60).toString() + " PM";
                            }
                        }
                    }
                    due.className = "small-text card-title select-text";
                    var description = document.createElement("label");
                    description.innerHTML = periods[0][e][1];
                    description.className = "card-description select-text";
    
                    var contentScroll = document.createElement("div");
                    contentScroll.className = "content-scroll";
    
                    contentScroll.appendChild(name);
                    contentScroll.appendChild(due);
                    contentScroll.appendChild(description);
    
                    completeGeneral2 = document.createElement("button");
                    completeGeneral2.className = "rectangle-button";
                    completeGeneral2.id = (0).toString() + "/" + e.toString();
                    completeGeneral2.innerHTML = "Complete";
    
                    var newCard = document.createElement("div");
                    newCard.className = "card";
                    newCard.id = (00).toString() + "/" + e.toString();
    
                    newCard.appendChild(contentScroll);
                    newCard.appendChild(completeGeneral2);
    
                    cardContainer.appendChild(newCard);
                    generalEvents++;
                    removeGeneral2(completeGeneral2.id);   
                }
            }
        } else {

            /* if there are events next period and all are not due in the future, add next period section */
            if (savePeriod !== 0) {
                var nextPeriodFutures = false;
                var counter2 = 0;
                for (i = 0; i < periods[savePeriod + 1].length; i++) {
                    var nowDate = new Date();
                    nowDate.setHours(0, 0, 0, 0);
                    var dueDate = periods[savePeriod + 1][i][2];
                    if (dueDate.getFullYear() !== nowDate.getFullYear() || dueDate.getMonth() !== nowDate.getMonth() || dueDate.getDate() !== nowDate.getDate()) {
                        counter2++;
                    }
                }
                if (counter2 == periods[savePeriod + 1].length) {
                    nextPeriodFutures = true;
                }
                if (lengths[savePeriod + 1] !== 0 && nextPeriodFutures == false) {
                    var cardContainer = document.createElement("div");
                    cardContainer.className = "card-container";
    
                    var newDiv = document.createElement("div");
                    newDiv.className = "section";
                    newDiv.id = "next-period";
    
                    var newLabel = document.createElement("label");   
                    newLabel.innerHTML = "Next Period";
                    newLabel.className = "title";
                    
                    newDiv.appendChild(newLabel);
                    newDiv.appendChild(cardContainer);
                    document.getElementById("main-container").appendChild(newDiv);
    
                    var nowDate = new Date();
                    nowDate.setHours(0, 0, 0, 0);
                    
                    for (e = 0; e < lengths[savePeriod + 1]; e++) {
                        var dueDate = periods[savePeriod + 1][e][2];
                        if (dueDate.getFullYear() == nowDate.getFullYear() && dueDate.getMonth() == nowDate.getMonth() && dueDate.getDate() == nowDate.getDate()) {
                            var name = document.createElement("label");
                            name.innerHTML = periods[savePeriod + 1][e][0];
                            name.className = "section-title card-title select-text";
    
                            var due = document.createElement("label");
                            if (periods[savePeriod + 1][e][3] < 720) {
                                if (periods[savePeriod + 1][e][3] % 60 < 10) {
                                    due.innerHTML = "Due " + (Math.floor(periods[savePeriod + 1][e][3] / 60)).toString() + ":0" + (periods[savePeriod + 1][e][3] % 60).toString() + " AM";
                                } else {
                                    due.innerHTML = "Due " + (Math.floor(periods[savePeriod + 1][e][3] / 60)).toString() + ":" + (periods[savePeriod + 1][e][3] % 60).toString() + " AM";
                                }
                            } else {
                                if (periods[savePeriod + 1][e][3] < 780) {
                                    if (periods[savePeriod + 1][e][3] % 60 < 10) {
                                        due.innerHTML = "Due " + (Math.floor(periods[savePeriod + 1][e][3] / 60)).toString() + ":0" + (periods[savePeriod + 1][e][3] % 60).toString() + " PM";
                                    } else {
                                        due.innerHTML = "Due " + (Math.floor(periods[savePeriod + 1][e][3] / 60)).toString() + ":" + (periods[savePeriod + 1][e][3] % 60).toString() + " PM";
                                    }
                                } else {
                                    if (periods[savePeriod + 1][e][3] % 60 < 10) {
                                        due.innerHTML = "Due " + ((Math.floor(periods[savePeriod + 1][e][3] / 60)) - 12).toString() + ":0" + (periods[savePeriod + 1][e][3] % 60).toString() + " PM";
                                    } else {
                                        due.innerHTML = "Due " + ((Math.floor(periods[savePeriod + 1][e][3] / 60)) - 12).toString() + ":" + (periods[savePeriod + 1][e][3] % 60).toString() + " PM";
                                    }
                                }
                            }
                            due.className = "small-text card-title select-text";
    
                            var description = document.createElement("label");
                            description.innerHTML = periods[savePeriod + 1][e][1];
                            description.className = "card-description select-text";
    
                            var contentScroll = document.createElement("div");
                            contentScroll.className = "content-scroll";
    
                            contentScroll.appendChild(name);
                            contentScroll.appendChild(due);
                            contentScroll.appendChild(description);
    
                            completeNext = document.createElement("button");
                            completeNext.className = "rectangle-button";
                            completeNext.id = (savePeriod + 1).toString() + "/" + e.toString();
                            completeNext.innerHTML = "Complete";
    
                            var newCard = document.createElement("div");
                            newCard.className = "card";
                            
                            newCard.appendChild(contentScroll);
                            newCard.appendChild(completeNext);
    
                            cardContainer.appendChild(newCard);
                            removeNext(completeNext.id);
                        }
                    }
                }
            }

            /* if there are events later in the day and all are not due in the future, add later today section */
            if (savePeriod !== 0) {
                var bool = false;
                for (d = savePeriod + 2; d < periodNumber + 1; d++) {
                    if (lengths[d] !== 0) {
                        bool = true;
                        break;
                    }
                }
    
                var laterPeriodFutures = false;
                var counter3 = 0;
                var totalEvents;
                for (j = savePeriod + 2; j < periodNumber + 1; j++) {
                    for (i = 0; i < periods[j].length; i++) {
                        var nowDate = new Date();
                        nowDate.setHours(0, 0, 0, 0);
                        var dueDate = periods[j][i][2];
                        if (dueDate.getFullYear() !== nowDate.getFullYear() || dueDate.getMonth() !== nowDate.getMonth() || dueDate.getDate() !== nowDate.getDate()) {
                            counter3++;
                        }
                    }
                    totalEvents += periods[j].length;
                }
                if (counter3 == totalEvents) {
                    laterPeriodFutures = true;
                }
                if (bool == true && laterPeriodFutures == false) {
                    var cardContainer = document.createElement("div");
                    cardContainer.className = "card-container";
    
                    var newDiv = document.createElement("div");
                    newDiv.className = "section";
                    newDiv.id = "later-period";
    
                    var newLabel = document.createElement("label");   
                    newLabel.innerHTML = "Later Today";
                    newLabel.className = "title";
                    
                    newDiv.appendChild(newLabel);
                    newDiv.appendChild(cardContainer);
                    document.getElementById("main-container").appendChild(newDiv);
    
                    var nowDate = new Date();
                    nowDate.setHours(0, 0, 0, 0);
    
                    for (f = savePeriod + 2; f < periodNumber + 1; f++) {
                        for (e = 0; e < lengths[f]; e++) {
                            var dueDate = periods[f][e][2];
                            if (dueDate.getFullYear() == nowDate.getFullYear() && dueDate.getMonth() == nowDate.getMonth() && dueDate.getDate() == nowDate.getDate()) {
                                var name = document.createElement("label");
                                name.innerHTML = periods[f][e][0];
                                name.className = "section-title card-title select-text";
    
                                var due = document.createElement("label");
                                if (periods[f][e][3] < 720) {
                                    if (periods[f][e][3] % 60 < 10) {
                                        due.innerHTML = "Due " + (Math.floor(periods[f][e][3] / 60)).toString() + ":0" + (periods[f][e][3] % 60).toString() + " AM";
                                    } else {
                                        due.innerHTML = "Due " + (Math.floor(periods[f][e][3] / 60)).toString() + ":" + (periods[f][e][3] % 60).toString() + " AM";
                                    }
                                } else {
                                    if (periods[f][e][3] < 780) {
                                        if (periods[f][e][3] % 60 < 10) {
                                            due.innerHTML = "Due " + (Math.floor(periods[f][e][3] / 60)).toString() + ":0" + (periods[f][e][3] % 60).toString() + " PM";
                                        } else {
                                            due.innerHTML = "Due " + (Math.floor(periods[f][e][3] / 60)).toString() + ":" + (periods[f][e][3] % 60).toString() + " PM";
                                        }
                                    } else {
                                        if (periods[f][e][3] % 60 < 10) {
                                            due.innerHTML = "Due " + ((Math.floor(periods[f][e][3] / 60)) - 12).toString() + ":0" + (periods[f][e][3] % 60).toString() + " PM";
                                        } else {
                                            due.innerHTML = "Due " + ((Math.floor(periods[f][e][3] / 60)) - 12).toString() + ":" + (periods[f][e][3] % 60).toString() + " PM";
                                        }
                                    }
                                }
                                due.className = "small-text card-title select-text";
    
                                var description = document.createElement("label");
                                description.innerHTML = periods[f][e][1];
                                description.className = "card-description select-text";
    
                                var contentScroll = document.createElement("div");
                                contentScroll.className = "content-scroll";
    
                                contentScroll.appendChild(name);
                                contentScroll.appendChild(due);
                                contentScroll.appendChild(description);
    
                                completeLater = document.createElement("button");
                                completeLater.className = "rectangle-button";
                                completeLater.id = (f).toString() + "/" + e.toString();
                                completeLater.innerHTML = "Complete";
    
                                var newCard = document.createElement("div");
                                newCard.className = "card";
                                
                                newCard.appendChild(contentScroll);
                                newCard.appendChild(completeLater);
    
                                cardContainer.appendChild(newCard);
                                laterEvents++;
                                removeLater(completeLater.id);
                            }
                        }
                    }
                }
            }

            var allFutures = false;
            var counter4 = 0;
            for (j = 0; j < periodNumber + 1; j++) {
                for (i = 0; i < periods[j].length; i++) {
                    var nowDate = new Date();
                    nowDate.setHours(0, 0, 0, 0);
                    var dueDate = periods[j][i][2];
                    if (dueDate.getFullYear() !== nowDate.getFullYear() || dueDate.getMonth() !== nowDate.getMonth() || dueDate.getDate() !== nowDate.getDate()) {
                        counter4++;
                    }
                }
            }
            if (counter4 > 0) {
                allFutures = true;
            }
            if (lengths[0] !== 0 || allFutures == true) {
                var cardContainer = document.createElement("div");
                cardContainer.className = "card-container";
    
                var newDiv = document.createElement("div");
                newDiv.className = "section";
                newDiv.id = "general-period";
    
                var newLabel = document.createElement("label");  
                newLabel.innerHTML = "General";
                newLabel.className = "title";
                
                newDiv.appendChild(newLabel);
                newDiv.appendChild(cardContainer);
                document.getElementById("main-container").appendChild(newDiv);
    
                var nowDate = new Date();
                nowDate.setHours(0, 0, 0, 0);
                
                for (f = 1; f < periodNumber + 1; f++) {
                    for (e = 0; e < lengths[f]; e++) {
                        var dueDate = periods[f][e][2];
                        if (dueDate.getFullYear() !== nowDate.getFullYear() || dueDate.getMonth() !== nowDate.getMonth() || dueDate.getDate() !== nowDate.getDate()) {
                            var name = document.createElement("label");
                            name.innerHTML = periods[f][e][0];
                            name.className = "section-title card-title select-text";
    
                            var due = document.createElement("label");
                            if (periods[f][e][3] < 720) {
                                if (periods[f][e][3] % 60 < 10) {
                                    due.innerHTML = "Due " + (dueDate.getMonth() + 1).toString() + "/" + (dueDate.getDate()).toString() + "/" + (dueDate.getFullYear()).toString() + " at " + (Math.floor(periods[f][e][3] / 60)).toString() + ":0" + (periods[f][e][3] % 60).toString() + " AM";
                                } else {
                                    due.innerHTML = "Due " + (dueDate.getMonth() + 1).toString() + "/" + (dueDate.getDate()).toString() + "/" + (dueDate.getFullYear()).toString() + " at " + (Math.floor(periods[f][e][3] / 60)).toString() + ":" + (periods[f][e][3] % 60).toString() + " AM";
                                }
                            } else {
                                if (periods[f][e][3] < 780) {
                                    if (periods[f][e][3] % 60 < 10) {
                                        due.innerHTML = "Due " + (dueDate.getMonth() + 1).toString() + "/" + (dueDate.getDate()).toString() + "/" + (dueDate.getFullYear()).toString() + " at " + (Math.floor(periods[f][e][3] / 60)).toString() + ":0" + (periods[f][e][3] % 60).toString() + " PM";
                                    } else {
                                        due.innerHTML = "Due " + (dueDate.getMonth() + 1).toString() + "/" + (dueDate.getDate()).toString() + "/" + (dueDate.getFullYear()).toString() + " at " + (Math.floor(periods[f][e][3] / 60)).toString() + ":" + (periods[f][e][3] % 60).toString() + " PM";
                                    }
                                } else {
                                    if (periods[f][e][3] % 60 < 10) {
                                        due.innerHTML = "Due " + (dueDate.getMonth() + 1).toString() + "/" + (dueDate.getDate()).toString() + "/" + (dueDate.getFullYear()).toString() + " at " + ((Math.floor(periods[f][e][3] / 60)) - 12).toString() + ":0" + (periods[f][e][3] % 60).toString() + " PM";
                                    } else {
                                        due.innerHTML = "Due " + (dueDate.getMonth() + 1).toString() + "/" + (dueDate.getDate()).toString() + "/" + (dueDate.getFullYear()).toString() + " at " + ((Math.floor(periods[f][e][3] / 60)) - 12).toString() + ":" + (periods[f][e][3] % 60).toString() + " PM";
                                    }
                                }
                            }
                            due.className = "small-text card-title select-text";
    
                            var description = document.createElement("label");
                            description.innerHTML = periods[f][e][1];
                            description.className = "card-description select-text";
    
                            var contentScroll = document.createElement("div");
                            contentScroll.className = "content-scroll";
    
                            contentScroll.appendChild(name);
                            contentScroll.appendChild(due);
                            contentScroll.appendChild(description);
    
                            completeGeneral1 = document.createElement("button");
                            completeGeneral1.className = "rectangle-button";
                            completeGeneral1.id = (f).toString() + "/" + e.toString();
                            completeGeneral1.innerHTML = "Complete";
    
                            var newCard = document.createElement("div");
                            newCard.className = "card";
                            
                            newCard.appendChild(contentScroll);
                            newCard.appendChild(completeGeneral1);
    
                            cardContainer.appendChild(newCard);
                            generalEvents++;
                            removeGeneral1(completeGeneral1.id);
                        }
                    }
                }
    
                for (e = 0; e < lengths[0]; e++) {
                    var dueDate = periods[0][e][2];
                    var name = document.createElement("label");
                    name.innerHTML = periods[0][e][0];
                    name.className = "section-title card-title select-text";
    
                    var due = document.createElement("label");
                    if (periods[0][e][3] < 720) {
                        if (periods[0][e][3] % 60 < 10) {
                            due.innerHTML = "Due " + (dueDate.getMonth() + 1).toString() + "/" + (dueDate.getDate()).toString() + "/" + (dueDate.getFullYear()).toString() + " at " + (Math.floor(periods[0][e][3] / 60)).toString() + ":0" + (periods[0][e][3] % 60).toString() + " AM";
                        } else {
                            due.innerHTML = "Due " + (dueDate.getMonth() + 1).toString() + "/" + (dueDate.getDate()).toString() + "/" + (dueDate.getFullYear()).toString() + " at " + (Math.floor(periods[0][e][3] / 60)).toString() + ":" + (periods[0][e][3] % 60).toString() + " AM";
                        }
                    } else {
                        if (periods[0][e][3] < 780) {
                            if (periods[0][e][3] % 60 < 10) {
                                due.innerHTML = "Due " + (dueDate.getMonth() + 1).toString() + "/" + (dueDate.getDate()).toString() + "/" + (dueDate.getFullYear()).toString() + " at " + (Math.floor(periods[0][e][3] / 60)).toString() + ":0" + (periods[0][e][3] % 60).toString() + " PM";
                            } else {
                                due.innerHTML = "Due " + (dueDate.getMonth() + 1).toString() + "/" + (dueDate.getDate()).toString() + "/" + (dueDate.getFullYear()).toString() + " at " + (Math.floor(periods[0][e][3] / 60)).toString() + ":" + (periods[0][e][3] % 60).toString() + " PM";
                            }
                        } else {
                            if (periods[0][e][3] % 60 < 10) {
                                due.innerHTML = "Due " + (dueDate.getMonth() + 1).toString() + "/" + (dueDate.getDate()).toString() + "/" + (dueDate.getFullYear()).toString() + " at " + ((Math.floor(periods[0][e][3] / 60)) - 12).toString() + ":0" + (periods[0][e][3] % 60).toString() + " PM";
                            } else {
                                due.innerHTML = "Due " + (dueDate.getMonth() + 1).toString() + "/" + (dueDate.getDate()).toString() + "/" + (dueDate.getFullYear()).toString() + " at " + ((Math.floor(periods[0][e][3] / 60)) - 12).toString() + ":" + (periods[0][e][3] % 60).toString() + " PM";
                            }
                        }
                    }
                    due.className = "small-text card-title select-text";
                    var description = document.createElement("label");
                    description.innerHTML = periods[0][e][1];
                    description.className = "card-description select-text";
    
                    var contentScroll = document.createElement("div");
                    contentScroll.className = "content-scroll";
    
                    contentScroll.appendChild(name);
                    contentScroll.appendChild(due);
                    contentScroll.appendChild(description);
    
                    completeGeneral2 = document.createElement("button");
                    completeGeneral2.className = "rectangle-button";
                    completeGeneral2.id = (0).toString() + "/" + e.toString();
                    completeGeneral2.innerHTML = "Complete";
    
                    var newCard = document.createElement("div");
                    newCard.className = "card";
    
                    newCard.appendChild(contentScroll);
                    newCard.appendChild(completeGeneral2);
    
                    cardContainer.appendChild(newCard);
                    generalEvents++;
                    removeGeneral2(completeGeneral2.id);   
                }
            }
        }
    }
}

function createPeriods() {

    /* var declaration and setting of the start time */
    var startTime;
    var startTimeInput;
    var colonIndex;
    var startTimeHours;
    var startTimeMinutes;
    startTimeInput = document.getElementById("input0").value;
    colonIndex = startTimeInput.indexOf(":");
    startTimeHours = startTimeInput.slice(0, colonIndex);
    startTimeMinutes = startTimeInput.slice(colonIndex + 1, startTimeInput.length);
    startTime = (parseInt(startTimeHours) * 60) + parseInt(startTimeMinutes);

    /* period numbers */
    periodNumber = parseInt(document.getElementById("input1").value);

    /* period length var */
    var periodLength;
    periodLength = parseInt(document.getElementById("input2").value);

    /* off time in between period length var */
    var offLength;
    offLength = parseInt(document.getElementById("input3").value);

    /* check validity of inputs */
    /* clear warnings and such */
    document.getElementById("settings-warning1").style.display = "none";
    document.getElementById("settings-warning2").style.display = "none";
    document.getElementById("settings-warning3").style.display = "none";
    document.getElementById("settings-warning4").style.display = "none";
    document.getElementById("settings-warning5").style.display = "none";
    document.getElementById("browser-warning").style.display = "none";
    document.getElementById("done").style.display = "none";
    document.getElementById("hint").style.display = "none";
    var invalid = false;

    if (periodNumber > 20) {
        document.getElementById("settings-warning1").style.display = "inline";
        document.getElementById("settings-warning-icon1").style.display = "inline";
        invalid = true;
    }

    if (periodNumber < 1) {
        document.getElementById("settings-warning2").style.display = "inline";
        document.getElementById("settings-warning-icon2").style.display = "inline";
        invalid = true;
    }

    if (periodLength < 1) {
        document.getElementById("settings-warning3").style.display = "inline";
        document.getElementById("settings-warning-icon3").style.display = "inline";
        invalid = true;
    }

    if ((periodLength * periodNumber) + (offLength * (periodNumber - 1)) + startTime >= 1440) {
        document.getElementById("settings-warning4").style.display = "inline";
        document.getElementById("settings-warning-icon4").style.display = "inline";
        invalid = true;
    }

    if (offLength < 1) {
        document.getElementById("settings-warning5").style.display = "inline";
        document.getElementById("settings-warning-icon5").style.display = "inline";
        invalid = true;
    }
    if (invalid == false) {
       /* period array creation  */
       periodTimes.splice(0, periodTimes.length);
       periodTimes.push(startTime);
       for (i = 1; i < 2 * periodNumber; i++) {
        if (i % 2 == 1) {
            var newTime;
            var oldTime;
            oldTime = periodTimes[periodTimes.length - 1];
            newTime = oldTime + periodLength;
            periodTimes.push(newTime);

        } else if (i % 2 == 0) {
            var newTime;
            var oldTime;
            oldTime = periodTimes[periodTimes.length - 1];
            newTime = oldTime + offLength;
            periodTimes.push(newTime);
        }
    } 
    /* show success writing */
    document.getElementById("done").style.display = "inline";
    document.getElementById("done-icon").style.display = "inline";

    }
    findPeriodNum();
}

/* functions to open and close the settings menu */
function closeMenu() {
    if (ifMenuOpen == true) {
        document.getElementById("settings-menu").style.display = "none";
        ifMenuOpen = false;
    }
    document.getElementById("period-number").style.filter = "";
    document.getElementById("time-left").style.filter = "";
    document.getElementById("main-container").style.filter = "";
}

function openMenu() {
    closeEventsMenu();
    closeInfoMenu();
    if (ifMenuOpen == false) {
        document.getElementById("settings-menu").style.display = "";
        ifMenuOpen = true;
    }
    document.getElementById("period-number").style.filter = "blur(4px)";
    document.getElementById("time-left").style.filter = "blur(4px)";
    document.getElementById("main-container").style.filter = "blur(4px)";
}

function settings() {
    if (ifMenuOpen == true) {
        closeMenu();
    } else if (ifMenuOpen == false) {
        openMenu();
        resetSettings();
    }
}

function resetSettings() {
    // resets inputs to default
    document.getElementById("input0").value = "08:00";
    document.getElementById("input1").value = "9";
    document.getElementById("input2").value = "41";
    document.getElementById("input3").value = "4";
    // clears warnings
    document.getElementById("settings-warning1").style.display = "none";
    document.getElementById("settings-warning2").style.display = "none";
    document.getElementById("settings-warning3").style.display = "none";
    document.getElementById("settings-warning4").style.display = "none";
    document.getElementById("settings-warning5").style.display = "none";
    document.getElementById("browser-warning").style.display = "none";
    document.getElementById("done").style.display = "none";
    document.getElementById("hint").style.display = "none";
}

/* functions to open and close the add event menu */
function openEventsMenu() {
    closeInfoMenu();
    closeMenu();
    /* clears the warnings and messages */

    document.getElementById("events-warning0").style.display = "none";
    document.getElementById("events-warning1").style.display = "none";
    document.getElementById("events-warning2").style.display = "none";
    document.getElementById("events-warning3").style.display = "none";
    document.getElementById("events-warning4").style.display = "none";
    document.getElementById("events-warning5").style.display = "none";
    document.getElementById("events-warning6").style.display = "none";
    document.getElementById("events-warning7").style.display = "none";
    document.getElementById("added").style.display = "none";

    const oem = gsap.timeline();

    if (ifEventsMenuOpen == false) {
        document.getElementById("events-menu").style.display = "";
        oem.fromTo("#events-menu", {scale: 0, opacity: 0}, {scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)"});
        ifEventsMenuOpen = true;
    }

    document.getElementById("period-number").style.filter = "blur(4px)";
    document.getElementById("time-left").style.filter = "blur(4px)";
    document.getElementById("main-container").style.filter = "blur(4px)";

    /* checks if setup has been done already */
    if (periodTimes.length == 0) {
        document.getElementById("events-warning0").style.display = "inline";
        document.getElementById("events-warning-icon0").style.display = "inline";
        invalidEvents = true;
    }
}

function closeEventsMenu() {
    if (ifEventsMenuOpen == true) {
        const cem = gsap.timeline();
        cem.fromTo("#events-menu", {scale: 1, opacity: 1}, {scale: 0, opacity: 0, duration: 0.6, ease: "back.in(1.7)"});
        //document.getElementById("events-menu").style.display = "none";
        ifEventsMenuOpen = false;
    }

    document.getElementById("period-number").style.filter = "";
    document.getElementById("time-left").style.filter = "";
    document.getElementById("main-container").style.filter = "";
}

function add() {
    if (ifEventsMenuOpen == true) {
        closeEventsMenu();
    } else if (ifEventsMenuOpen == false) {
        openEventsMenu();
        resetEvents();
    }
}

function resetEvents() {
    // resets inputs to default
    document.getElementById("new-event-name").value = "";
    document.getElementById("new-event-description").value = "";
    document.getElementById("new-event-time").value = "23:59";
    document.getElementById("new-event-date").value = new Date().toDateInputValue();
    // clears warnings
    document.getElementById("events-warning0").style.display = "none";
    document.getElementById("events-warning1").style.display = "none";
    document.getElementById("events-warning2").style.display = "none";
    document.getElementById("events-warning3").style.display = "none";
    document.getElementById("events-warning4").style.display = "none";
    document.getElementById("events-warning5").style.display = "none";
    document.getElementById("events-warning6").style.display = "none";
    document.getElementById("events-warning7").style.display = "none";
    document.getElementById("added").style.display = "none";
}

/* functions to open and close the info menu */
function openInfoMenu() {
    closeEventsMenu();
    closeMenu();
    if (ifInfoMenuOpen == false) {
        document.getElementById("info-menu").style.display = "";
        ifInfoMenuOpen = true;
    }
    document.getElementById("period-number").style.filter = "blur(4px)";
    document.getElementById("time-left").style.filter = "blur(4px)";
    document.getElementById("main-container").style.filter = "blur(4px)";
}

function closeInfoMenu() {
    if (ifInfoMenuOpen == true) {
        document.getElementById("info-menu").style.display = "none";
        ifInfoMenuOpen = false;
    }
    
    document.getElementById("period-number").style.filter = "";
    document.getElementById("time-left").style.filter = "";
    document.getElementById("main-container").style.filter = "";
}

function info() {
    if (ifInfoMenuOpen == true) {
        closeInfoMenu();
    } else if (ifInfoMenuOpen == false) {
        openInfoMenu();
    }
}

/* function for assigning the events to their respective periods and such */
function assignEvent() {
    /* creating vars to store the due date and due time */
    var dateInput;
    dateInput = document.getElementById("new-event-date").value;
    var dueDate = new Date(dateInput + "T00:00:00");
    var nowDate = new Date();
    nowDate.setHours(0, 0, 0, 0);
    var now = new Date();
    var nowMinutes;
    nowMinutes = (now.getHours() * 60) + now.getMinutes();

    /* getting the due time */
    var dueTime;
    var dueTimeInput;
    var dueTimeMinutes;
    var dueTimeHours;
    dueTimeInput = document.getElementById("new-event-time").value;
    colonIndex = dueTimeInput.indexOf(":");
    dueTimeHours = dueTimeInput.slice(0, colonIndex);
    dueTimeMinutes = dueTimeInput.slice(colonIndex + 1, dueTimeInput.length);
    dueTime = (parseInt(dueTimeHours) * 60) + parseInt(dueTimeMinutes);

    /* storing event name */
    var eventName;
    eventName = document.getElementById("new-event-name").value;

    /* storing event desription */
    var eventDescription;
    eventDescription = document.getElementById("new-event-description").value;

    /* clear warnings and such */
    var invalidEvents = false;
    document.getElementById("events-warning0").style.display = "none";
    document.getElementById("events-warning1").style.display = "none";
    document.getElementById("events-warning2").style.display = "none";
    document.getElementById("events-warning3").style.display = "none";
    document.getElementById("events-warning4").style.display = "none";
    document.getElementById("events-warning5").style.display = "none";
    document.getElementById("events-warning6").style.display = "none";
    document.getElementById("events-warning7").style.display = "none";
    document.getElementById("added").style.display = "none";

    // check validity of inputs
    if (periodTimes.length == 0) {
        document.getElementById("events-warning0").style.display = "inline";
        document.getElementById("events-warning-icon0").style.display = "inline";
        invalidEvents = true;
    }

    if ((dueDate.getDay() == 6 || dueDate.getDay() == 7) && document.getElementById("new-event-visibility").selectedIndex == "1") {
        document.getElementById("events-warning1").style.display = "inline";
        document.getElementById("events-warning-icon1").style.display = "inline";
        invalidEvents = true;
    }

    if (dueTime > periodTimes[periodTimes.length - 1] && document.getElementById("new-event-visibility").selectedIndex == "1") {
        document.getElementById("events-warning2").style.display = "inline";
        document.getElementById("events-warning-icon2").style.display = "inline";
        invalidEvents = true;
    }

    if (dueTime < periodTimes[0] && document.getElementById("new-event-visibility").selectedIndex == "1") {
        document.getElementById("events-warning3").style.display = "inline";
        document.getElementById("events-warning-icon3").style.display = "inline";
        invalidEvents = true;
    }

    if (document.getElementById("new-event-name").value == "") {
        document.getElementById("events-warning4").style.display = "inline";
        document.getElementById("events-warning-icon4").style.display = "inline";
        invalidEvents = true;
    }

    if (document.getElementById("new-event-date").value == "") {
        document.getElementById("events-warning5").style.display = "inline";
        document.getElementById("events-warning-icon5").style.display = "inline";
        invalidEvents = true;
    }

    if (dueDate.getFullYear() < nowDate.getFullYear()) {
        document.getElementById("events-warning6").style.display = "inline";
        document.getElementById("events-warning-icon6").style.display = "inline";
        invalidEvents = true;
    } else if (dueDate.getFullYear() == nowDate.getFullYear()) {
        if (dueDate.getMonth() < nowDate.getMonth()) {
            document.getElementById("events-warning6").style.display = "inline";
            document.getElementById("events-warning-icon6").style.display = "inline";
            invalidEvents = true;
        } else if (dueDate.getMonth() == nowDate.getMonth()) {
            if (dueDate.getDate() < nowDate.getDate()) {
                document.getElementById("events-warning6").style.display = "inline";
                document.getElementById("events-warning-icon6").style.display = "inline";
                invalidEvents = true;
            } else if (dueDate.getDate() == nowDate.getDate()) {
                if (dueTime <= nowMinutes) {
                    document.getElementById("events-warning6").style.display = "inline";
                    document.getElementById("events-warning-icon6").style.display = "inline";
                    invalidEvents = true;
                }
            }
        }
    }

    if (document.getElementById("new-event-visibility").selectedIndex == "1") {
        for (b = 1; b < periodTimes.length - 1; b++) {
            if (b % 2 == 1) {
                if (dueTime == periodTimes[b]) {
                    document.getElementById("events-warning7").style.display = "inline";
                    document.getElementById("events-warning-icon7").style.display = "inline";
                    invalidEvents = true;
                    break;
                } else if (dueTime > periodTimes[b]) {
                    if (dueTime < periodTimes[b + 1]) {
                        document.getElementById("events-warning7").style.display = "inline";
                        document.getElementById("events-warning-icon7").style.display = "inline";
                        invalidEvents = true;
                        break;
                    }
                }
            }
        }
    }

    if (invalidEvents == false) {
        var newArr = [];
        newArr.push(eventName);
        newArr.push(eventDescription);
        newArr.push(dueDate);
        newArr.push(dueTime);
        if (document.getElementById("new-event-visibility").selectedIndex == "0") {
            /* if the visibility is general */
            general.push(newArr);

            /* show success message */
            document.getElementById("added").style.display = "inline";
            document.getElementById("added-icon").style.display = "inline";
        } else {
            // if the visibility is not general, put the events in the right period arrays
            if (dueTime == periodTimes[0]) {
                period1.push(newArr);
            } else if (dueTime > periodTimes[0]) {
                if (dueTime < periodTimes[1]) {
                    period1.push(newArr);
                }
            } 

            if (dueTime == periodTimes[2]) {
                period2.push(newArr);
            } else if (dueTime > periodTimes[2]) {
                if (dueTime < periodTimes[3]) {
                    period2.push(newArr);
                }
            }

            if (dueTime == periodTimes[4]) {
                period3.push(newArr);
            } else if (dueTime > periodTimes[4]) {
                if (dueTime < periodTimes[5]) {
                    period3.push(newArr);
                }
            }

            if (dueTime == periodTimes[6]) {
                period4.push(newArr);
            } else if (dueTime > periodTimes[6]) {
                if (dueTime < periodTimes[7]) {
                    period4.push(newArr);
                }
            }

            if (dueTime == periodTimes[8]) {
                period5.push(newArr);
            } else if (dueTime > periodTimes[8]) {
                if (dueTime < periodTimes[9]) {
                    period5.push(newArr);
                }
            }

            if (dueTime == periodTimes[10]) {
                period6.push(newArr);
            } else if (dueTime > periodTimes[10]) {
                if (dueTime < periodTimes[11]) {
                    period6.push(newArr);
                }
            }

            if (dueTime == periodTimes[12]) {
                period7.push(newArr);
            } else if (dueTime > periodTimes[12]) {
                if (dueTime < periodTimes[13]) {
                    period7.push(newArr);
                }
            }

            if (dueTime == periodTimes[14]) {
                period8.push(newArr);
            } else if (dueTime > periodTimes[14]) {
                if (dueTime < periodTimes[15]) {
                    period8.push(newArr);
                }
            }

            if (dueTime == periodTimes[16]) {
                period9.push(newArr);
            } else if (dueTime > periodTimes[16]) {
                if (dueTime < periodTimes[17]) {
                    period9.push(newArr);
                }
            }

            if (dueTime == periodTimes[18]) {
                period10.push(newArr);
            } else if (dueTime > periodTimes[18]) {
                if (dueTime < periodTimes[19]) {
                    period10.push(newArr);
                }
            }

            if (dueTime == periodTimes[20]) {
                period11.push(newArr);
            } else if (dueTime > periodTimes[20]) {
                if (dueTime < periodTimes[21]) {
                    period11.push(newArr);
                }
            }

            if (dueTime == periodTimes[22]) {
                period12.push(newArr);
            } else if (dueTime > periodTimes[22]) {
                if (dueTime < periodTimes[23]) {
                    period12.push(newArr);
                }
            }

            if (dueTime == periodTimes[24]) {
                period13.push(newArr);
            } else if (dueTime > periodTimes[24]) {
                if (dueTime < periodTimes[25]) {
                    period13.push(newArr);
                }
            }

            if (dueTime == periodTimes[26]) {
                period14.push(newArr);
            } else if (dueTime > periodTimes[26]) {
                if (dueTime < periodTimes[27]) {
                    period14.push(newArr);
                }
            }

            if (dueTime == periodTimes[28]) {
                period15.push(newArr);
            } else if (dueTime > periodTimes[28]) {
                if (dueTime < periodTimes[29]) {
                    period15.push(newArr);
                }
            }

            if (dueTime == periodTimes[30]) {
                period16.push(newArr);
            } else if (dueTime > periodTimes[30]) {
                if (dueTime < periodTimes[31]) {
                    period16.push(newArr);
                }
            }

            if (dueTime == periodTimes[32]) {
                period17.push(newArr);
            } else if (dueTime > periodTimes[32]) {
                if (dueTime < periodTimes[33]) {
                    period17.push(newArr);
                }
            }

            if (dueTime == periodTimes[34]) {
                period18.push(newArr);
            } else if (dueTime > periodTimes[34]) {
                if (dueTime < periodTimes[35]) {
                    period18.push(newArr);
                }
            }

            if (dueTime == periodTimes[36]) {
                period19.push(newArr);
            } else if (dueTime > periodTimes[36]) {
                if (dueTime < periodTimes[37]) {
                    period19.push(newArr);
                }
            }

            if (dueTime == periodTimes[38]) {
                period20.push(newArr);
            } else if (dueTime > periodTimes[38]) {
                if (dueTime < periodTimes[39]) {
                    period20.push(newArr);
                }
            }
            document.getElementById("added").style.display = "inline";
            document.getElementById("added-icon").style.display = "inline";
        }
        sectionAdder();
    }
}