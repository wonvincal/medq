package domain.clinic;

import core.Customer;

public class Patient extends Customer {
	private String lastName;
	private String firstName;
	private String id;
	
	public String getId(){
		return id;
	}
	
	public void setId(String value){
		id = value;
	}
	
	public String getLastName(){
		return lastName;
	}
	
	public void setLastName(String value){
		lastName = value;
	}
	
	public String getFirstName(){
		return firstName;
	}
	
	public void setFirstName(String value){
		firstName = value;
	}
	

}
