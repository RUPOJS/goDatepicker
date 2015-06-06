/**
 * A Simple, lightweight, configurable Datepicker/Calendar written in pure JavaScript.
 * @version 0.1
 * @author Rupesh Singh
 * @method calen
 * @param {string} params - The config params to be sent by the end user.
 */
var calen = function(params) {
    /**
     * Description: To check if a year is leap year or not.
     * @method leap_year
     * @param {number} yr - Accepts year and checks if its a leap year or not.
     * @return {Boolean} Returns if its a leap year.
     */
    var leap_year = function(yr) {
        return (yr % 400 === 0) || (yr % 4 === 0 && yr % 100 !== 0);
    };
    /**
     * Description: To return name of days in a particular language.
     * @todo - Return name of days in more language/Support for more languages.
     * @method get_dow_names
     * @param {string} loc - Accepts locale and returns name of days accordingly
     * @return {Array} Name of days in an array.
     */
    var get_dow_names = function(loc) {
        return (['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']);
    };
    /**
     * Description: To return name of months in a particular language.
     * @todo - Return name of days in more language/Support for more languages.
     * @method get_month_names
     * @param {string} loc - Accepts locale and returns name of days accordingly.
     * @return {Array} Name of months in an array.
     */
    var get_month_names = function(loc) {
        return (['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']);
    };
    /**
     * Description: To check how many days are there in a month
     * @method days_in_month
     * @param {Number} month_num - Accepts number of month to check the total days of that month
     * @param {Number} full_year - Accepts the year
     * @return {Number} Total number of days in a month
     */
    var days_in_month = function(month_num, full_year) {
        // Jan == 0, Feb == 1, Mar == 2, ...
        if (month_num === 0 || month_num === 2 || month_num === 4 ||
            month_num === 6 || month_num === 7 || month_num === 9 || month_num === 11) {
            return (31);
        }
        if (month_num === 3 || month_num === 5 ||
            month_num === 8 || month_num === 10) {
            return (30);
        }
        return (leap_year(full_year) ? 29 : 28);
    };
    /**
     * Description: To convert date string into Date object
     * @method my_moment_alter
     * @param {string} date_str - Accepts date string to convert it to date object
     * @return {Object} Date object of the date string
     */
    var my_moment_alter = function(date_str) {
        if (Object.prototype.toString.call(date_str) === "[object Date]") {
            return date_str;
        } else if (Object.prototype.toString.call(date_str) === "[object String]") {
            return new Date(date_str);
        } else {
            var to_be_returned = new Date();
            return to_be_returned;
        }
    };
    /**
     * Description: To limit the calendar's maximum date available.
     * @method get_max_date
     * @param {string} param_max_date  Accepts string for limiting calendar upto a fixed range
     *@return {Object} Returns a date object set to max_date.
     */
    var get_max_date = function(param_max_date) {
        // Acceptable parameter formats: 3M, 6M, 9M, 1Y, 2Y, * (infinity)
        var date = new Date();
        var month = date.getMonth();
        var year = date.getFullYear();
        switch (param_max_date) {
            case '3M':
                if ((month + 3) > 11) {
                    month = (month + 3) % 12;
                    year++;
                } else {
                    month += 3;
                }
                break;
            case '6M':
                if ((month + 6) > 11) {
                    month = (month + 6) % 12;
                    year++;
                } else {
                    month += 6;
                }
                break;
            case '9M':
                if ((month + 9) > 11) {
                    month = (month + 9) % 12;
                    year++;
                } else {
                    month += 9;
                }
                break;
            case '2Y':
                year += 2;
                break;
            case '*':
                year = 3125;
                break;
            default: // '1Y' is the default
                year += 1;
        }
        return (new Date(year, month, date.getDate()));
    };
    /**
     * Description: To limit the calendar's minimum available date
     * @method get_min_date
     * @param {string} param_min_date Accepts string for limiting calendar upto a minimum range
     *@return {Object} Returns a date object set to min_date.
     */
    var get_min_date = function(param_min_date) {
        // Return a date object set to min_date.
        // Acceptable parameter formats: 0, 3M, 6M, 9M, 1Y, 2Y, * (infinity)
        var date = new Date();
        var month = date.getMonth();
        var year = date.getFullYear();
        // If a Date object is passed in, use that.
        if (param_min_date instanceof Date) {
            return (param_min_date);
        }
        switch (param_min_date) {
            case '3M':
                if ((month - 3) < 0) {
                    month = (month - 3) % 12;
                    year--;
                } else {
                    month -= 3;
                }
                break;
            case '6M':
                if ((month - 6) < 0) {
                    month = (month - 6) % 12;
                    year--;
                } else {
                    month -= 6;
                }
                break;
            case '9M':
                if ((month - 9) < 0) {
                    month = (month - 9) % 12;
                    year--;
                } else {
                    month -= 9;
                }
                break;
            case '1Y':
                year -= 1;
                break;
            case '2Y':
                year -= 2;
                break;
            case '*':
                year = 1900;
                break;
            default:
                break; // default is the current date
        }
        return (new Date(year, month, date.getDate()));
    };
    // calen options and variables taken from end user
    var calen_dob = false;
    var MAX_CALENDARS = 2;
    var type_of_calen = params.type_of_calen || '';
    var dp_id_name = params.dp_id_name || ''; // selector id where to display the datepicker
    var id_name = params.id_name || ''; // selector id where to populate a selected date
    var locale = params.locale || 'en'; // As of now, only 'en' is supported, can be extended if required
    var ondateselected_callback = (params.onDateSelected instanceof Function) ? params.onDateSelected : null;
    var onclose_callback = (params.onClose instanceof Function) ? params.onClose : null;
    var display_count = params.display_count || 1;
    display_count = (display_count > MAX_CALENDARS) ? MAX_CALENDARS : display_count;
    var close_onselect = params.close_onselect;
    close_onselect = (close_onselect == undefined) ? true : close_onselect;
    var max_date = get_max_date((params.max_date || '1Y')); // max date user can scroll forward to
    var min_date = get_min_date((params.min_date || '*')); // min date user can scroll back to
    var currdate = new Date();
    var today = new Date(currdate.getFullYear(), currdate.getMonth(), currdate.getDate());
    var month_names = get_month_names(locale); // array of month names
    var day_names = get_dow_names(locale); // array of day of week names
    //  var yy = currdate.getFullYear();            // 4-digit year
    var mn = (currdate.getTime() < min_date.getTime()) ? min_date.getMonth() : currdate.getMonth();
    var yy = (currdate.getTime() < min_date.getTime()) ? min_date.getFullYear() : currdate.getFullYear();
    var citem = {
        day: 0,
        month: 0,
        year: 1900,
        first_dow: 0,
        total_days: 0,
        offset: 0,
        multi_cal: '',
        /**
         * Description: To create markups for the calendar.
         * @method markup
         * @param {string} unique_id Accepts id as string to create caledar for that id.
         */
        markup: function(unique_id) {
            var the_html = '',
                defaultDate = selected();
            defaultDate = defaultDate === '' ? today : my_moment_alter(defaultDate);
            if (this.offset >= this.first_dow) {
                var tmp_date = new Date(this.year, this.month, this.day),
                    td_id = unique_id +
                    this.month + '_' + this.day + '_' + this.year,
                    className = '';
                if (tmp_date.valueOf() > max_date.valueOf()) {
                    className = 'jrdp_calendar_day1_noselect';
                } else if (tmp_date.valueOf() < min_date.valueOf()) {
                    className = 'jrdp_calendar_day1_noselect';
                } else if (tmp_date.valueOf() === defaultDate.setHours(0, 0, 0, 0)) {
                    className = 'jrdp_calendar_current_day';
                } else {
                    className = 'jrdp_calendar_day1';
                }
                className += this.multi_cal;
                the_html += '<td id="' + td_id + '" class="' + className + '" ><div class="calDate"><span>' + this.day + '</span></div></td>';
                if (this.day >= this.total_days) {
                    this.first_dow = 999;
                }
            } else {
                the_html += '<td class="jrdp_calendar_day2' + this.multi_cal + '">&nbsp;</td>';
            }
            this.offset++;
            if (this.offset > this.first_dow) {
                this.day++;
            }
            return (the_html);
        }
    };
    /**
     * Description: To close the calendar
     * @method close_datepicker
     */
    var close_datepicker = function() {
        if (close_onselect) {
            document.getElementById(dp_id_name).innerHTML = '';
            if (id_name != '') {
                //                eval('document.getElementById("' + id_name + '").focus();');
                //                document.getElementById(id_name).focus();
            }
            if (onclose_callback != undefined) {
                onclose_callback();
            }
        }
    };
    /**
     * Description: To select the date from the calendar
     * @method select_date
     * @param {Number} mm - Accepts month to be selected
     * @param {Number} dd - Accepts date to be selected
     * @param {Number} yy - Accepts year to be selected
     */
    var select_date = function(mm, dd, yy) {
        var the_month, the_day;
        mm++; // Note: mm is the month number 0 - 11 so always add 1.
        if (mm < 10) {
            the_month = "0" + mm;
        } else {
            the_month = mm.toString();
        }
        if (dd < 10) {
            the_day = "0" + dd;
        } else {
            the_day = dd.toString();
        }
        if (id_name != '') {
            if (locale === 'en') {
                /*eval('document.getElementById("' + id_name + '").value = the_month + "/" + the_day + "/" + yy');*/
                var expr = 'document.getElementById("' + id_name + '").setAttribute("data-date", "' + the_month + '/' + the_day + '/' + yy + '");';
                eval(expr);
                var dateStr = new Date(yy, the_month - 1, dd);
                document.getElementById(id_name).value = dateStr;
            }
        }
        if (ondateselected_callback != undefined) {
            ondateselected_callback();
        }
        close_datepicker();
    };
    /**
     * Description: To increase the month
     * @method month_inc
     */
    var month_inc = function() {
        var scroll_date = new Date(yy, mn, today.getDate());
        if ((scroll_date.getFullYear() == max_date.getFullYear()) &&
            (scroll_date.getMonth() >= max_date.getMonth())) {
            return;
        }
        if (mn < 11) {
            mn++;
        } else {
            mn = 0;
            yy++;
        }
        that.show();
    };
    /**
     * Description: To decrease the month
     * @method month_dec
     */
    var month_dec = function() {
        var scroll_date = new Date(yy, mn, today.getDate());
        if ((scroll_date.getFullYear() == min_date.getFullYear()) &&
            (scroll_date.getMonth() <= min_date.getMonth())) {
            return;
        }
        if (mn > 0) {
            mn--;
        } else {
            mn = 11;
            yy--;
        }
        that.show();
    };
    /**
     * Description: To get the pre selected date from the data attribute, if any.
     * @method selected
     * @return {string} Returns the pre-selected date(by user)
     */
    var selected = function() {
        return document.getElementById(id_name).getAttribute('data-date');
    };
    var that = {
        selected: function() {
            return selected();
        },
        /**
         * Description: To hide the calendar
         * @method hide
         */
        hide: function() {
            close_datepicker();
        },
        /**
         * Description: To set minimum date if we need to override the min_date param.
         * @method set_min_date
         * @param {string} mdate - Accepts date to set the minimum date
         */
        set_min_date: function(mdate) {
            // This will override the min_date param.
            if (mdate instanceof Date) {
                min_date = mdate;
                var currTime = currdate.getTime(),
                    minTime = min_date.getTime();
                if (currTime < minTime) {
                    mn = min_date.getMonth();
                    yy = min_date.getFullYear();
                } else {
                    mn = currdate.getMonth();
                    yy = currdate.getFullYear();
                }
            }
        },
        /**
         * Description: To set maximum date if we need to override the max_date param.
         * @method set_max_date
         * @param {string} mdate - Accepts date to set the maximum date
         */
        set_max_date: function(mdate, limDate) {
            if (mdate instanceof Date) {
                max_date = mdate; console.log(max_date);
                var currTime = currdate.getTime(),
                    maxTime = max_date.getTime();
                var limitingMonth = limDate.getMonth();
                if (currTime < maxTime && limitingMonth!=11) {
                    mn = limitingMonth;
                    yy = max_date.getFullYear();
                } else {
                    mn = currdate.getMonth();
                    yy = currdate.getFullYear();
                }
            }
        },
        /**
         * Description: To show the calendar
         * @method show
         */
        show: function() {
            var calendarList = document.getElementsByClassName('datePicker'); //[0].innerHTML = '';
            for (var i = 0; i < calendarList.length; i++) {
                calendarList[i].innerHTML = '';
            }
            if (dp_id_name == undefined) return;
            var calendar_html = '';
            var unique_id = 'jrdp_' + dp_id_name + '_';
            calendar_html = '<table id="jrdp_' + dp_id_name + '" class="jrdp_encapsulated_table" cellspacing="0" cellpadding="0">';
            calendar_html += '<tr>';
            for (i = 0; i < display_count; i++) {
                citem.day = 1;
                citem.month = mn;
                citem.year = yy;
                if (i > 0) {
                    if (mn < 11) {
                        citem.month = mn + 1;
                    } else {
                        citem.month = 0;
                        citem.year = yy + 1;
                    }
                }
                var thisDate = new Date(citem.year, citem.month, 0);
                citem.offset = 0;
                citem.first_dow = thisDate.getDay(); // 0 - 6 (sun - sat)
                citem.total_days = days_in_month(citem.month, citem.year);
                citem.multi_cal = (display_count > 1) ? '_multi' : '';
                calendar_html += '<td class="jrdp_calendar_box">';
                calendar_html += '<table class="jrdp_calendar' + citem.multi_cal + '" cellspacing="0" cellpadding="0">';
                if (!type_of_calen) {
                    calendar_html += '    <tr class="jrdp_calendar_month_tbar' + citem.multi_cal + '">';
                    calendar_html += '            <td colspan="1" class="jrdp_calendar_month_prev' + citem.multi_cal + '" align="left">';
                    calendar_html += '                <span id="' + unique_id + 'prevmonth' + citem.multi_cal + '_' + i + '">&lsaquo;</span></td>';
                    calendar_html += '            <td colspan="5" class="jrdp_calendar_month' + citem.multi_cal + '" align="center">' + month_names[citem.month] + ' ' + citem.year + '<div class="currentDate"><span id="show_today" class="showToday">Today</span></div></td>';
                    calendar_html += '            <td colspan="1" class="jrdp_calendar_month_next' + citem.multi_cal + '" align="right">';
                    calendar_html += '                <span id="' + unique_id + 'nextmonth' + citem.multi_cal + '_' + i + '">&rsaquo;</span></td>';
                    calendar_html += '    </tr>';
                } else {
                    calendar_html += '    <tr class="jrdp_calendar_month_tbar' + citem.multi_cal + '">';
                    calendar_html += '            <td colspan="5" class="jrdp_calendar_month' + citem.multi_cal + '" align="center"><select id="DOB_M"><option value=' + month_names[citem.month] + '>' + month_names[citem.month] + '</option></select><select id="DOB_Y"><option value=' + citem.year + '>' + citem.year + '</option></select></td>';
                    calendar_html += '    </tr>';
                }
                calendar_html += '    <tr>';
                for (var j = 0; j < 7; j++) {
                    calendar_html += '<td class="jrdp_calendar_days' + citem.multi_cal + '">' + day_names[j] + '</td>';
                }
                calendar_html += '    </tr>';
                var rows_printed = 0;
                for (var j = 0; j < 6; j++) {
                    if (citem.first_dow == 999) {
                        break;
                    }
                    calendar_html += '            <tr>';
                    for (var k = 0; k < 7; k++) {
                        calendar_html += citem.markup(unique_id);
                    }
                    calendar_html += '            </tr>';
                    rows_printed++;
                }
                // Output empty rows if needed so we have a total of 6 rows printed.
                for (var j = 0; j < (6 - rows_printed); j++) {
                    calendar_html += '<tr>';
                    for (var k = 0; k < 7; k++) {
                        calendar_html += '<td class="jrdp_calendar_day2' + citem.multi_cal + '">&nbsp;</td>';
                    }
                    calendar_html += '</tr>';
                }
                calendar_html += '</table>';
                calendar_html += '</td>';
            }
            calendar_html += '</tr></table>';
            document.getElementById(dp_id_name).innerHTML = calendar_html;
            // Setup event listeners for elements.
            //
            // These methods replace the existing click event listener(s) on the element if there are any.
            // Because this was essentially part of DOM 0, this method is very widely supported and requires
            // no special cross–browser code; hence it is normally used to register event listeners dynamically.
            for (var j = 0; j < i; j++) {
                if (!type_of_calen) {
                    document.getElementById(unique_id + 'prevmonth' + citem.multi_cal + '_' + j).onclick = month_dec;
                    document.getElementById(unique_id + 'nextmonth' + citem.multi_cal + '_' + j).onclick = month_inc;
                    document.getElementById(unique_id + 'prevmonth' + citem.multi_cal + '_' + j).display = "";
                    document.getElementById(unique_id + 'nextmonth' + citem.multi_cal + '_' + j).display = "";
                }
            }
            // Attach event listeners to the following events so that the datepicker
            // will close when the user clicks outside of the calendar.
            document.getElementsByTagName('body')[0].onmousedown = close_datepicker;
            document.getElementById('jrdp_' + dp_id_name).onmouseover = function(e) {
                // IE 7-8 does not support event.currentTarget but does so for event.srcElement;
                var target, target_id, ev = e || window.event;
                var using_srcElement = false;
                try {
                    target = ev.currentTarget;
                } catch (err) {
                    target = ev.srcElement;
                    using_srcElement = true;
                }
                try {
                    target_id = target.id;
                } catch (err) {
                    target_id = (target) ? target : 'jrdp_' + dp_id_name;
                }
                if (target_id) {
                    document.getElementById(target_id).onmouseover = function() {
                        document.getElementsByTagName('body')[0].onmousedown = null;
                    };
                }
                document.getElementsByTagName('body')[0].onmousedown = null;
            };
            document.getElementById('jrdp_' + dp_id_name).onmouseout = function(e) {
                // IE 7-8 does not support event.currentTarget but does so for event.srcElement;
                var target, target_id, ev = e || window.event;
                var using_srcElement = false;
                try {
                    target = ev.currentTarget;
                } catch (err) {
                    target = ev.srcElement;
                    using_srcElement = true;
                }
                try {
                    target_id = target.id;
                } catch (err) {
                    target_id = (target) ? target : 'jrdp_' + dp_id_name;
                }
                if (target_id) {
                    document.getElementById(target_id).onmouseout = function() {
                        document.getElementsByTagName('body')[0].onmousedown = close_datepicker;
                    };
                }
                document.getElementsByTagName('body')[0].onmousedown = close_datepicker;
            };
            // Bind event listeners to each day for the onclick event.  Get an array of
            // elements by the class name so we can get the element id name.
            //var day_tds = document.querySelectorAll('.jrdp_calendar_day1' + citem.multi_cal);
            var day_tds = document.getElementsByClassName('jrdp_calendar_day1' + citem.multi_cal);
            for (var i = 0; i < day_tds.length; i++) {
                // The id is in the format of 'jrdp_idname_mm_dd_yy'.
                // So if we split on the '_' then we can use the last three elements.
                var items = day_tds[i].id.split('_');
                var mmtmp = items[items.length - 3];
                var ddtmp = items[items.length - 2];
                var yytmp = items[items.length - 1];
                var tmp_id = unique_id + mmtmp + '_' + ddtmp + '_' + yytmp;
                var s = 'document.getElementById("' + tmp_id + '").onclick = ';
                s += 'function(e) { e.stopPropagation();e.preventDefault();  select_date(' + mmtmp + ',' + ddtmp + ',' + yytmp + '); };';
                if (document.getElementById(tmp_id)) {
                    eval(s);
                }
            }
            // Check for the current day node because it will have a different class name.
            //var curr_day_td = document.querySelectorAll('.jrdp_calendar_current_day' + citem.multi_cal);
            var curr_day_td = document.getElementsByClassName('jrdp_calendar_current_day' + citem.multi_cal);
            if (curr_day_td.length > 0) {
                var items = curr_day_td[0].id.split('_');
                var mmtmp = items[items.length - 3];
                var ddtmp = items[items.length - 2];
                var yytmp = items[items.length - 1];
                var tmp_id = unique_id + mmtmp + '_' + ddtmp + '_' + yytmp;
                var s = 'document.getElementById("' + tmp_id + '").onclick = ';
                s += 'function() { select_date(' + mmtmp + ',' + ddtmp + ',' + yytmp + '); };';
                if (document.getElementById(tmp_id)) {
                    eval(s);
                }
            }
            if (type_of_calen) {
                for (var i = 0; i < month_names.length; i++) {
                    var dob_month_markup = '<option value=' + month_names[i] + '> ' + month_names[i] + ' </option>';
                    if (month_names[citem.month] == month_names[i]) {
                        continue;
                    }
                    document.getElementById('DOB_M').innerHTML += dob_month_markup;
                }
                var temp_year_range = type_of_calen.split(')')[0].split(':')[1];
                if (calen_dob == false) {
                    temp_year = citem.year;
                    calen_dob = true;
                }
                var threshold_year = parseInt(temp_year - temp_year_range);
                for (var i = temp_year; i >= threshold_year; i--) {
                    var dob_year_markup = '<option value=' + i + '> ' + i + ' </option>';
                    if (document.getElementById('DOB_Y').value == i) {
                        continue;
                    }
                    document.getElementById('DOB_Y').innerHTML += dob_year_markup;
                }
                document.getElementById('DOB_M').onchange = function() {
                    switch (this.value) {
                        case 'January':
                            mn = 0;
                            break;
                        case 'February':
                            mn = 1;
                            break;
                        case 'March':
                            mn = 2;
                            break;
                        case 'April':
                            mn = 3;
                            break;
                        case 'May':
                            mn = 4;
                            break;
                        case 'June':
                            mn = 5;
                            break;
                        case 'July':
                            mn = 6;
                            break;
                        case 'August':
                            mn = 7;
                            break;
                        case 'September':
                            mn = 8;
                            break;
                        case 'October':
                            mn = 9;
                            break;
                        case 'November':
                            mn = 10;
                            break;
                        case 'December':
                            mn = 11;
                            break;
                        case 'default':
                            break;
                    }
                    yy = document.getElementById('DOB_Y').value;
                    that.show();
                }
                document.getElementById('DOB_Y').onchange = function() {
                    switch (document.getElementById('DOB_M').value) {
                        case 'January':
                            mn = 0;
                            break;
                        case 'February':
                            mn = 1;
                            break;
                        case 'March':
                            mn = 2;
                            break;
                        case 'April':
                            mn = 3;
                            break;
                        case 'May':
                            mn = 4;
                            break;
                        case 'June':
                            mn = 5;
                            break;
                        case 'July':
                            mn = 6;
                            break;
                        case 'August':
                            mn = 7;
                            break;
                        case 'September':
                            mn = 8;
                            break;
                        case 'October':
                            mn = 9;
                            break;
                        case 'November':
                            mn = 10;
                            break;
                        case 'December':
                            mn = 11;
                            break;
                        case 'default':
                            break;
                    }
                    yy = document.getElementById('DOB_Y').value;
                    that.show();
                }
            }

            if (!type_of_calen) {
                document.getElementById('show_today').onclick = function() {
                    var now = new Date();
                    yy = now.getFullYear();
                    mn = now.getMonth();
                    that.show();
                }
            }
        }
    };
    return (that);
};
/**
 * Description: To format date from milliecods to Date
 * @method format_date
 * @param {Number} ms - Accepts Millisecods for converting into date
 */
function format_date(ms) {
    var d;
    d = new Date(ms);
    return zeropad((d.getMonth() + 1), 2) + '/' + zeropad(d.getDate(), 2) + '/' + d.getFullYear(); // Jan = 0
};
/**
 * Description: To append/add zero accordingly, to month/day numbers.
 * @method zeropad
 * @param {Number} num - Accepts Numbers
 * @param {Number} zeros - Accpts number of zeors
 * @return {string} Returns the corrected value after appending/adding zeros accordingly
 */
function zeropad(num, zeros) {
    var retval = '';
    var numstr = num.toString();
    for (var i = numstr.length; i < zeros; i++) {
        retval += '0';
    }
    retval += numstr;
    return retval;
};
/**
 * Description: To pick the date and to adjust the next calendar(if any).
 * @method DatePicked
 * @param {string} trigger - Accepts type of calendar
 * @param {string} datepicker - Accppts id as string
 * @param {Number} mindays - [Optional] Accepts minimum days to be disabled in next calendar(if any), measuring from the selected date
 * @param {Number} maxrange - [Optional] Accepts maximum range to be displayed in next calendar(if any), measuring from the selected date
 */
function DatePicked(trigger, datepicker, mindays, maxrange) {
    var checkin_date = (document.getElementById('start-date')) ? document.getElementById('start-date').getAttribute('data-date') : null;
    var checkout_date = (document.getElementById('end-date')) ? document.getElementById('end-date').getAttribute('data-date') : null;
    var DSToffset = 1000 * 60 * 60 * 4; // Take into consideration daylight-savings time change.
    // What triggered this function?
    trigger = (trigger == 'start-date' || trigger == 'end-date') ? trigger : '';
    try {
        var cindate = (checkin_date.match(/^\d{2}\/\d{2}\/\d{4}$/)) ? new Date(checkin_date) : null;
        var coutdate = (checkout_date.match(/^\d{2}\/\d{2}\/\d{4}$/)) ? new Date(checkout_date) : null;
    } catch (e) {};
    if (trigger == 'start-date' && cindate != null) {
        if (mindays) {
            var min_checkout_date = new Date(cindate.getTime() + mindays * 86400000);
        } else {
            var min_checkout_date = new Date(cindate.getTime() + DSToffset);
        }
        if (maxrange) {
            var max_checkout_date = new Date(cindate.getTime() + maxrange * 86400000);
        }
        coutdate = min_checkout_date;
        if (datepicker) {
            var mdate = new Date(min_checkout_date.getFullYear(), min_checkout_date.getMonth(), min_checkout_date.getDate());
            datepicker.set_min_date(mdate);
        }
        if (datepicker && maxrange) {
            var maxdate = new Date(max_checkout_date.getFullYear(), max_checkout_date.getMonth(), max_checkout_date.getDate());
            datepicker.set_max_date(maxdate, cindate);
        }
    } else {
        set_date_fields();
    }
};
/**
 * Description: To set the days/months/years to the respective hidden input elements.
 * @method set_date_fields
 * @return {string} Set days, months and year to the hidden elements(in markup)
 */
function set_date_fields() {
    var start_date = document.getElementById('start-date');
    var sdate = (start_date != null) ? new Date(start_date.getAttribute('data-date')) : null;
    /*var sdate = (start_date != null) ? new Date(start_date.value) : null;*/
    if (sdate != null) {
        document.getElementById('sDay').value = zeropad(sdate.getDate(), 2);
        document.getElementById('sMonth').value = zeropad((sdate.getMonth() + 1), 2);
        document.getElementById('sYear').value = sdate.getFullYear();
    }
};
