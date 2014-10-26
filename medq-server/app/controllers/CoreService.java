package controllers;

import play.mvc.*;

/***
 * Entry point of the whole system.
 * Inputs to the system are events.  Core service can record them before sending them to different
 * internal service; this is useful for future automated integration testing. 
 * @author Calvin
 *
 */
public class CoreService extends Controller {	
	
	public static Result login(){
		return ok("calvin.kl.wong@gmail.com");
	}

	public static Result list(){
		return TODO;
	}
	
	public static Result get(String id){
		return TODO;
	}
}
