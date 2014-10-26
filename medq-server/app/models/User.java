package models;

import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import play.db.ebean.Model;

/***
 * Anyone with a login to our system
 * @author Calvin
 *
 */
public class User extends Model {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	// Actual id should be created based on a global sequence in DB
	@Id
	private Long id;
	
	// User with Account is a business user
	private Account account;
	
	// Research on OAuth - login and email may not be required
	private final String login;
	private String email;
	
	private final Set<Queue> queues = new HashSet<Queue>();
	private final Set<Schedule> schedules = new HashSet<Schedule>();
	
	public User(String login){
		this.login = login;
	}
	
	public String toString(){
		return login;
	}
	
	public long getId(){
		return id;
	}
	public void setId(long value){
		id = value;
	}

	public Account getAccount(){
		return account;
	}
	
	public void setAccount(Account value){
		account = value;
	}
	
	public String getLogin(){
		return login;
	}

	public String getEmail(){
		return email;
	}
	public void setEmail(String value){
		email = value;
	}
		
	public boolean addQueue(Queue value){
		return queues.add(value);
	}

	public boolean removeQueue(Queue value){
		return queues.remove(value);
	}

	public boolean addSchedule(Schedule value){
		return schedules.add(value);
	}

	public boolean removeSchedule(Queue value){
		return schedules.remove(value);
	}
}
