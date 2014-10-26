package core;

import java.util.HashSet;
import java.util.Set;

import org.joda.time.LocalDateTime;

import com.google.common.collect.ImmutableSet;

/***
 * Base class
 * Each appointment can have more than one customers
 * Each appointment
 * Appointment, DoctorAppointment, DentalAppointment, HairDresserAppointment, ConsultantAppointment 
 * @author Calvin
 *
 */
public class Appointment {
	public static final ImmutableSet<Appointment> NULLSET = ImmutableSet.of();
	private Set<Customer> customers = new HashSet<Customer>();
	private LocalDateTime appointmentTime;
	private String note;
	private boolean receiveReminder;
	private AppointmentDetails appointmentDetails;
	
	public AppointmentDetails getAppointmentDetails(){
		return appointmentDetails;
	}
	
	public void setAppointmentDetails(AppointmentDetails value){
		appointmentDetails = value;
	}
	
	public boolean getReceiveReminder(){
		return receiveReminder;
	}
	
	public void setReceiveReminder(boolean value){
		receiveReminder = value;
	}
	
	public Set<Customer> getCustomers()
	{
		return customers;
	}
	
	public boolean addCustomer(Customer value){
		return customers.add(value);
	}
	
	public boolean removeCustomer(Customer value){
		return customers.remove(value);
	}

	public LocalDateTime getAppointmentTime()
	{
		return appointmentTime;
	}
	
	public void setAppointmentTime(LocalDateTime value)
	{
		appointmentTime = value;
	}

	public String getNote()
	{
		return note;
	}
	
	public void setNote(String value)
	{
		note = value;
	}
}
