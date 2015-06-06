# goDatepicker
A lightweight, easy to use datepicker calendar, without any external dependencies.

# Using goDatepicker

	To initialize datepicker, one need to have minimum this two lines of HTML:
	<span class="jrdp_calendar_pos" id="start-calen"></span>
        <input type="text" name="start-date" id="start-date" class="date-pick" readonly="readonly" value="mm/dd/yy" onclick="start_datepicker.show();" />


	Initialization part:
	var start_datepicker = calen({
	      dp_id_name: 'start-calen',     
	      id_name: 'start-date',                
	      max_date: '1Y',
	      min_date: '0',
	      display_count:2,
	      onDateSelected: function() { DatePicked('start-date', end_datepicker); }
	});
	      
	      To customize this component it needs to change the following values:
	      dp_id_name: 
		   location where the datepicker is to be displayed.
	      id_name:
		   selector id where to populate a selected date.
	      display_count:
		   number of months to display in datepicker,default is 1,maximum is 2.
	      max_date: 
		   maximum date user can scroll forward to default is 1Y (one year)  acceptable values: 0, 3M, 6M, 9M, 1Y, 2Y, * (infinity)
	      min_date:
		   minimum date user can scroll backward to default is 0 (current date)  acceptable values: 0, 3M, 6M, 9M, 1Y, 2Y, * (infinity)
	      close_onselect:
		  default is true, acceptable values: true | false.
	    
	    
	     (for more see calendar/index.html)

# Any feedback/contribution will be appreciated.
