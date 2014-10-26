package core;

public class Customer {
	// Internal id for each customer
	private long cid;
	private Phone primaryNumber;
	
	// Number that notification will be delivered to other than primary number
	private Phone notificationNumber;
	
	private String email;
	private boolean receiveSMSNotification;
	private boolean receiveAVCNotification;
	private boolean receiveEmailNotification;
	
	public long getCid(){
		return cid;
	}
	
	public void setCid(long value){
		cid = value;
	}
	
	public Phone getPrimaryNumber(){
		return primaryNumber;
	}
	
	public void setPrimaryNumber(Phone value){
		primaryNumber = value;
	}
		
	public Phone getNotificationNumber(){
		return notificationNumber;
	}
	
	public void setNotificationNumber(Phone value){
		notificationNumber = value;
	}
	
	public String getEmail(){
		return email;
	}
	
	public void setEmail(String value){
		email = value;
	}
	
	public boolean getReceiveSMSNotification(){
		return receiveSMSNotification;
	}

	public boolean getReceiveEmailNotification(){
		return receiveEmailNotification;
	}

	public boolean getReceiveAVCNotification(){
		return receiveAVCNotification;
	}
}
