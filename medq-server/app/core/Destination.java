package core;

/***
 * Message destination: SMS, email, automated voice call...etc
 * @author Calvin
 *
 */
public class Destination {
	private String address;
	private DestinationType destType;
	
	private Destination(String address, DestinationType destType){
		this.address = address;
		this.destType = destType;
	}
	
	public DestinationType getDestType(){
		return destType;
	}
	
	public void setDestType(DestinationType value){
		destType = value;
	}
	
	public String getAddress(){
		return address;
	}
	
	public void setAddress(String value){
		address = value;
	}
	
	public static class Builder{
		public static Destination createFrom(Phone value){
			// TODO - More logics to be implemented here
			if (value.getCanReceiveSMS()){
				return new Destination(value.getDialingNumber(), DestinationType.SMS);
			}
			else{
				return new Destination(value.getDialingNumber(), DestinationType.PHONE);
			}
		}
		public static Destination createFromEmail(String value){
			return new Destination(value, DestinationType.EMAIL);
		}
	}
} 