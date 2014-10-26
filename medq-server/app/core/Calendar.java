package core;

import java.util.HashSet;
import java.util.Set;
import java.util.SortedSet;
import java.util.TreeMap;
import java.util.TreeSet;

import org.joda.time.LocalDate;

/***
 * NOT THREAD-SAFE - Make sure all operations are done on the same thread or introduce sync blocks below
 * A calendar of appointment.  Each appointment has its own appointment date and time.
 * This is a proxy data structure to group appointments by different categories, like:
 * 1) Month
 * 2) Day
 * 3) Timeslot
 * @author Calvin
 *
 */
public class Calendar {
	
	private final Set<Appointment> appointments = new HashSet<Appointment>();
	
	// A cache of appointment for date; normally people care only about today's appointments 
	// I want to make it very specific that the set of Appointment is a sorted set
	// We can take a look at Guava.MultiSet
	private  final TreeMap<LocalDate, SortedSet<Appointment>> appointmentsByDate = new TreeMap<LocalDate, SortedSet<Appointment>>(); // @TODO Pass in a real comparator
	
	public boolean addAppointment(final Appointment value){
		boolean result = appointments.add(value);
		LocalDate date = value.getAppointmentTime().toLocalDate();
		if (appointmentsByDate.containsKey(date)){
			appointmentsByDate.get(date).add(value);
		}
		else{
			SortedSet<Appointment> newSet = new TreeSet<Appointment>();
			newSet.add(value);
			appointmentsByDate.put(date, newSet);
		}
		return result;
	}
	
	public boolean removeAppointment(Appointment value){
		boolean result = appointments.remove(value);
		LocalDate date = value.getAppointmentTime().toLocalDate();
		if (appointmentsByDate.containsKey(date))
		{
			appointmentsByDate.get(date).remove(value);
		}
		return result;
	}

	public Set<Appointment> getAppointmentsByDate(LocalDate date){
		Set<Appointment> result = appointmentsByDate.get(date);
		if (result == null){
			result = Appointment.NULLSET;
		}
		return result;
	}
}
