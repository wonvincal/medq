package models;

public class Account {
	// Credit card info may become a class on its own
	private String creditCardNumber;
	private String address;
	
	public String getAddress(){
		return address;
	}
	
	public void setAddress(String value){
		address = value;
	}

	public String getCreditCardNumber(){
		return creditCardNumber;
	}
	
	public void setCreditCardNumber(String value){
		creditCardNumber = value;
	}
}
