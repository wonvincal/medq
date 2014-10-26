package service;

import play.mvc.Controller;
import play.mvc.Result;

/***
 * UserService manages the following user related operations.  CRUD of users, authentication, permissions and possibly session 
 * management.
 * User can be logged into the system in two ways: 1) as a queue/schedule owner, 2) as a queue/schedule viewer
 * @author Calvin
 *
 */
public class UserService extends Controller {

	public static Result list(){
		return TODO;
	}
	
	public static Result get(String id){
		return TODO;
	}
}
