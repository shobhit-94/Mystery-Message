// khuch api respone asa ho sakte hai jisme user n sirf message bhza hai
// khuch api respone asa ho sakte hai jisme humne kai saare messages collect kia hai or unhe hum 
// show kerwana chathe hai


import { Message } from "@/model/User";//ab message ka inteface dubara se banne ke need nhi hai
//humne ek pehle se hi abna rakhha hai model/user me use hi use ker ro
export interface ApiResponse {
    success: boolean;
    message: string
    isAcceptingMessages?: boolean//hame har ba na bhexna pade isAcceptingMeassage isliye optional baana diya
    messages?: Array<Message>//hame har ba na bhexna pade meassage ko isliye optional baana diya
}