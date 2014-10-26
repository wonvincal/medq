package core;

public class Phone {
	private String countryCode;
	private String dialingNumber;
	private boolean canReceiveSMS;
	
	public String getCountryCode(){
		return countryCode;
	}
	
	public void setCountryCode(String value){
		countryCode = value;
	}
	
	public String getDialingNumber(){
		return dialingNumber;
	}
	
	public void setDialingNumber(String value){
		dialingNumber = value;
	}
	
	public boolean getCanReceiveSMS(){
		return canReceiveSMS;
	}
	
	public void setCanReceiveSMS(boolean value){
		canReceiveSMS = value;
	}
}