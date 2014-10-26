package models;

import core.Calendar;
import core.Professional;

/***
 * A general schedule that holds appointments
 * @author Calvin
 *
 */
public class Schedule {

	private Professional professional;
	private Calendar calendar;
	
	public Professional getProfessional()
	{
		return professional;
	}
	
	public void setProfessional(Professional value)
	{
		professional = value;
	}

	public Calendar getCalendar(){
		return calendar;
	}
	
	public void setCalendar(Calendar value){
		calendar = value;
	}
}
