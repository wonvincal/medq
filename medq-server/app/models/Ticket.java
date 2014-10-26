package models;

import java.util.HashSet;
import java.util.Set;

import org.joda.time.LocalDateTime;

import com.google.common.base.Strings;

import core.Appointment;
import core.Customer;
import core.Destination;
import core.TicketState;

/***
 * 
 * @author Calvin
 *
 */
public class Ticket {
	private long id;
	private TicketState state;	
	private LocalDateTime arrivalTime;
	private LocalDateTime estimatedTime;
	private Appointment appointment;
	
	// Each Ticket should have its own NotificationDestination(s): e.g. SMS and/or APP
	// If an Appointment is attached to a Ticket, its notificationDests should be the Appointment's primary and notification numbers
	// If no Appointment is attached to a Ticket, its notificationDests should be Ticket specific.
	private final Set<Destination> notificationDests = new HashSet<Destination>();
	
	public TicketState getState(){
		return state;
	}
	
	public void setState(TicketState value){
		state = value;
	}
	
	public long getId()
	{
		return id;
	}

	// TODO - Revisit the logic here
	public Set<Destination> getNotificationDests(){
		HashSet<Destination> result = new HashSet<>(notificationDests); 
		if (appointment != null){
			for (Customer customer : appointment.getCustomers()){
				if (customer.getReceiveSMSNotification()){
					result.add(Destination.Builder.createFrom(customer.getPrimaryNumber()));
					if (customer.getNotificationNumber() != null){
						result.add(Destination.Builder.createFrom(customer.getNotificationNumber()));
					}
				}
				if (customer.getReceiveEmailNotification() && !Strings.isNullOrEmpty(customer.getEmail())){
					result.add(Destination.Builder.createFromEmail(customer.getEmail()));
				}
			}
		}
		return result;		
	}
	
	public Appointment getAppointment()
	{
		return appointment;
	}
	
	public void setAppointment(Appointment value)
	{
		appointment = value;
	}
	
	public LocalDateTime getArrivalTime(){
		return arrivalTime;
	}
	
	public void setArrivalTime(LocalDateTime value){
		arrivalTime = value;
	}
	
	public LocalDateTime getEstimatedTime(){
		return estimatedTime;
	}
	
	public void setEstimatedTime(LocalDateTime value){
		estimatedTime = value;
	}
	
	public boolean addNotificationDestination(Destination value){
		return notificationDests.add(value);
	}
	
	public boolean removeNotificationDestination(Destination value){
		return notificationDests.remove(value);
	}
}
