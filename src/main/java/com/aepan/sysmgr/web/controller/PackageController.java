/**
 * 
 */
package com.aepan.sysmgr.web.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import com._21cn.framework.exception.BusinessRuntimeException;
import com._21cn.framework.web.HttpRequestInfo;
import com.aepan.sysmgr.model.ProductOrder;
import com.aepan.sysmgr.model.User;
import com.aepan.sysmgr.model.config.PartnerConfig;
import com.aepan.sysmgr.model.log.OperationLog;
import com.aepan.sysmgr.model.packageinfo.PackageInfo;
import com.aepan.sysmgr.service.ConfigService;
import com.aepan.sysmgr.service.OrderService;
import com.aepan.sysmgr.service.PackageService;
import com.aepan.sysmgr.service.UserService;
import com.aepan.sysmgr.util.AjaxResponseUtil;
import com.aepan.sysmgr.util.ConfigManager;
import com.aepan.sysmgr.util.Constants;
import com.aepan.sysmgr.util.OperationLogUtil;
import com.aepan.sysmgr.util.UuidUtil;
import com.alibaba.fastjson.JSONObject;

/**
 * 套餐管理
 * @author rakika
 * 2015年8月10日下午3:44:11
 */
@Controller
public class PackageController extends DataTableController {

	
	private static final Logger logger = LoggerFactory.getLogger(PackageController.class);
	
	@Autowired
	PackageService packageService;
	@Autowired
	OrderService orderService;
	@Autowired
	UserService userService;
	@Autowired
	ConfigService configService;
	

	/**
	 * 购买套餐列表
	 * @param request
	 * @param response
	 * @param model
	 * @return
	 */
	@RequestMapping("/package/buypackagelist")
	public String buyPackageList(HttpServletRequest request, HttpServletResponse response, ModelMap model){
		if(!isLogin(request)){
			return "redirect:/login";
		}
		List<PackageInfo> packagelist = packageService.getList(PackageInfo.PACKAGE_TYPE_PACKAGE, 1, 3);
    	String currentPackageId = request.getParameter("currentPackageId");

		model.addAttribute("packageList", packagelist);
    	model.addAttribute("currentPackageId", currentPackageId);
		return "/package/buypackagelist";
	}
	
	
	
	/**
	 * 购买套餐列表
	 * @param request
	 * @param response
	 * @param model
	 * @return
	 */
	@RequestMapping("/package/welcome")
	public String buyPackagewelcome(HttpServletRequest request, HttpServletResponse response, ModelMap model){
		if(!isLogin(request)){
			return "redirect:/login";
		}
//		ThirdSessionManager.instance().isLogin(request);
		HttpSession session = request.getSession();
		User user = (User)session.getAttribute(Constants.SESSION_USER);
		String userIdStr = request.getParameter("userId");
		logger.info(userIdStr+"-buypackagewelcomesessionId:"+session.getId()+",user:"+user);
		return "/package/buypackagewelcome";
	}
	
	@RequestMapping("/package/finishpay")
	public String finishPay(ModelMap model){
		PartnerConfig partnerConfig = ConfigManager.getInstance().getPartnerConfig(configService);
		String partnerIndexUrl = partnerConfig.PARTNER_INDEX_URL;
		model.addAttribute("partnerIndexUrl", partnerIndexUrl);
		return "/package/buypackagesuccess";
	}
	
	@RequestMapping("/package/ispay")
	public String isPay(HttpServletRequest req,HttpServletResponse res,ModelMap model){
		if(!isLogin(req)){
			return "redirect:/login";
		}
		
		HttpSession session = req.getSession();
		
		String orderId = (String)session.getAttribute(Constants.CURRENT_PAY_PACKAGE_ORDER_ID);
		
		ProductOrder order = orderService.getByOrderId(orderId);
		
		if(ProductOrder.ORDER_STATUS_PAY_SUCCESS==order.getOrderStatus()){
			model.addAttribute("success", true);
		}else{
			model.addAttribute("success", false);
		}
		
		AjaxResponseUtil.returnData(res, JSONObject.toJSONString(model));
		return null;
	}
	
	
	/**
	 * 购买套餐第一步
	 * @param request
	 * @param response
	 * @param model
	 * @return
	 */
	@RequestMapping("/package/buypackageconfirm")
	public String buyPackageConfirm(HttpServletRequest request, HttpServletResponse response, ModelMap model){
		if(!isLogin(request)){
			return "redirect:/login";
		}
		HttpRequestInfo reqInfo = new HttpRequestInfo(request);
    	Integer id = reqInfo.getIntParameter("id", -1);
    	Integer duration = reqInfo.getIntParameter("duration", 0);
    	if(id > -1){
    		PackageInfo rpackage = packageService.getById(id);
    		if(rpackage == null){
                throw new BusinessRuntimeException( "error.param.wrong", "无效参数" );
            }
    		if(duration!=0){
    			rpackage.setDuration(duration);
    		}
    		float price = rpackage.getPrice();
    		float monthFlowPrice = rpackage.getMonthFlowPrice();
    		
    		float totalPrice = (price+monthFlowPrice)*duration;
    		totalPrice = (float)Math.round(totalPrice*100)/100;//保留两位小数点
    		
    		rpackage.setTotalPrice(totalPrice);
    		model.addAttribute("packageInfo", rpackage);
    	}
		return "/package/buypackageconfirm";
	}
	
	@RequestMapping("/package/pay")
	public String payPackage(HttpServletRequest request, HttpServletResponse response){
		
		HttpRequestInfo reqInfo = new HttpRequestInfo(request);
    	Integer id = reqInfo.getIntParameter("id", -1);
    	int payType = reqInfo.getIntParameter("payType");
    	int duration = reqInfo.getIntParameter("duration",0);
    	
		HttpSession session = request.getSession();
		User user = (User)session.getAttribute(Constants.SESSION_USER);
		logger.info("packagePaySessionId:"+session.getId()+",user:"+user);
    	
		
		if(!isLogin(request)){
			return "redirect:/login";
		}
		
		if(duration==0||id==-1){
			 throw new BusinessRuntimeException( "error.param.wrong", "无效参数" );
		}
    	PackageInfo rpackage = null;
		if(id > -1){
    		rpackage  = packageService.getById(id);
    		if(rpackage == null){
                throw new BusinessRuntimeException( "error.param.wrong", "无效参数" );
            }
    	}
    	
    	 //根据ID判断是否存在该User
//    	int userId = user.getId();
    	String userName = user.getUserName();
    	
    	 
        ProductOrder productOrder = new ProductOrder();
        //生成订单号
        String orderId =UuidUtil.get32UUID();
        productOrder.setOrderId(orderId);
        productOrder.setBuyersId(user.getId());
        productOrder.setBuyersName(userName);
        productOrder.setSellerId(1);
        productOrder.setChannelId("");
        
        productOrder.setAmount(duration);
        
        session.setAttribute(Constants.CURRENT_PAY_PACKAGE_ORDER_ID, orderId);
        float packagePrice = rpackage.getPrice();
        float monthFlowPrice = rpackage.getMonthFlowPrice();
        float totalPrice = (packagePrice+monthFlowPrice)*duration;
        
        totalPrice = (float)Math.round(totalPrice*100)/100;//保留两位小数点
        
//        productOrder.setSellerName(sellerUser.getUserName());
        String[] p = {rpackage.getId()+""};
        productOrder.setProductId(p);
        productOrder.setPrice(totalPrice);
        productOrder.setToAddress("");
        productOrder.setToMobile("");
        productOrder.setProductNames(rpackage.getName());
        productOrder.setPayfor(ProductOrder.PAY_FOR_PACKAGE);
        String[] quantity= {"1"};
		productOrder.setQuantity(quantity);
        logger.debug("productOrder:"+productOrder);
        orderService.create(productOrder);
//        redirect:/pay/alipay.do?total_fee=0.01&subject=ttttest
    	
		return "redirect:/pay/platformPay?payType="+payType+"&orderId="+orderId;
	}
	
	
	
	/**
	 * 
	 * @param request
	 * @param response
	 * @param model
	 * @return
	 */
	@RequestMapping("/package/show")
	public String show(HttpServletRequest request, HttpServletResponse response, ModelMap model){
		if(!isAdminLogin(request)){
			return "redirect:/login";
		}
		if(!hasAdminAuth(request, Constants.PRIVILEGECODE_PACKAGE)){
			model.put("error_desc", "Do not have privilege.");
			return "error";
		}
		HttpRequestInfo reqInfo = new HttpRequestInfo(request);
    	Integer id = reqInfo.getIntParameter("eqId", -1);
    	if(id > -1){
    		PackageInfo rpackage = packageService.getById(id);
    		if(rpackage == null){
                throw new BusinessRuntimeException( "error.param.wrong", "无效参数" );
            }
    		model.addAttribute("packageInfo", rpackage);
    	}
		return "/package/form";
	}
	
	/**
	 * 
	 * @param request
	 * @param response
	 * @param model
	 * @return
	 */
	@RequestMapping("/package/save")
	public String save(HttpServletRequest request, HttpServletResponse response, ModelMap model){
		if(!isAdminLogin(request)){
			return "redirect:/login";
		}
		
		if(!hasAdminAuth(request, Constants.PRIVILEGECODE_PACKAGE)){
			model.put("error_desc", "Do not have privilege.");
			return "error";
		}
		
		HttpRequestInfo reqInfo = new HttpRequestInfo(request);
    	PackageInfo rpackage = new PackageInfo();
    	rpackage.setName(reqInfo.getParameter("name"));
    	
    	Integer playerNum = reqInfo.getIntParameter("playerNum",0);
    	Integer videoNum = reqInfo.getIntParameter("videoNum",0);
    	Integer productNum = reqInfo.getIntParameter("productNum",0);
    	Float price = reqInfo.getFloatParameter("price",0);
    	Integer duration=reqInfo.getIntParameter("duration",0);
    	Float monthFlowPrice = reqInfo.getFloatParameter("monthFlowPrice",0);
    	float flowNum = reqInfo.getFloatParameter("flowNum",0);
    	
    	rpackage.setPlayerNum(playerNum);
    	rpackage.setPrice(price);
    	rpackage.setProductNum(productNum);
    	rpackage.setVideoNum(videoNum);
    	rpackage.setDuration(duration);
    	rpackage.setFlowNum(flowNum);
    	rpackage.setMonthFlowPrice(monthFlowPrice);
    	
    	logger.debug("save package:"+rpackage);
    	packageService.save(rpackage);
		return "redirect:/package/list.do";
	}
	
	/**
	 * 
	 * @param request
	 * @param response
	 * @param model
	 * @return
	 */
	@RequestMapping("/package/update")
	public String update(HttpServletRequest request, HttpServletResponse response, ModelMap model){
		if(!isAdminLogin(request)){
			return "redirect:/login";
		}
		
		if(!hasAdminAuth(request, Constants.PRIVILEGECODE_PACKAGE)){
			model.put("error_desc", "Do not have privilege.");
			return "error";
		}
		HttpRequestInfo reqInfo = new HttpRequestInfo(request);
    	Integer id = reqInfo.getIntParameter("id", -1);
    	if(id > -1){
    		PackageInfo rpackage = packageService.getById(id);
    		if(rpackage == null){
                throw new BusinessRuntimeException( "error.param.wrong", "无效参数" );
            }
    		rpackage.setId(id);
    		rpackage.setName(reqInfo.getParameter("name"));
        	Integer playerNum = reqInfo.getIntParameter("playerNum",0);
        	Integer videoNum = reqInfo.getIntParameter("videoNum",0);
        	Integer productNum = reqInfo.getIntParameter("productNum",0);
        	Float price = reqInfo.getFloatParameter("price",0);
        	Integer duration=reqInfo.getIntParameter("duration",0);
        	Float monthFlowPrice = reqInfo.getFloatParameter("monthFlowPrice",0);
        	float flowNum = reqInfo.getFloatParameter("flowNum",0);
        	
        	rpackage.setPlayerNum(playerNum);
        	rpackage.setPrice(price);
        	rpackage.setProductNum(productNum);
        	rpackage.setVideoNum(videoNum);
        	rpackage.setDuration(duration);
        	rpackage.setFlowNum(flowNum);
        	rpackage.setMonthFlowPrice(monthFlowPrice);
        	
        	logger.debug("update package:"+rpackage);
        	packageService.update(rpackage);
        	
        	User user = getAdminUser(request);
        	//记录操作日志
			OperationLogUtil.addLog(configService, 
					new OperationLog(OperationLog.TYPE_套餐, 
							user.getPartnerAccountId(),
							user.getPartnerAccountName(),
							"/package/update", 
							"修改套餐"+rpackage, 
							request.getRemoteAddr()));
    	}
		return "redirect:/package/list.do";
	}
	
	/**
	 * 获取list
	 * @param request
	 * @param response
	 * @param model
	 * @return
	 */
	@RequestMapping("/package/list")
	public String list(HttpServletRequest request, HttpServletResponse response, ModelMap model) {
		if(!isAdminLogin(request)){
			return "redirect:/login";
		}
		if(!hasAdminAuth(request, Constants.PRIVILEGECODE_PACKAGE)){
			model.put("error_desc", "Do not have privilege.");
			return "error";
		}
		//查询所有的资源
		List<PackageInfo> packagelist = packageService.getList(PackageInfo.PACKAGE_TYPE_ALL, 1, Integer.MAX_VALUE);
    	model.addAttribute("packageList", packagelist);
    	return "/package/list";
	}
	
	
	
	/**
	 * 新建套餐
	 * @param request
	 * @param response
	 * @param model
	 * @return
	 */
	@RequestMapping("/package/create")
	public String create(HttpServletRequest request, HttpServletResponse response, ModelMap model){
		if(!isAdminLogin(request)){
			return "redirect:/login";
		}
		if(!hasAdminAuth(request, Constants.PRIVILEGECODE_PACKAGE)){
			model.put("error_desc", "Do not have privilege.");
			return "error";
		}
		return "/package/form";
	}
	
	
	
	/**
	 * 新建套餐
	 * @param request
	 * @param response
	 * @param model
	 * @return
	 */
	@RequestMapping("/package/buyflow")
	public String buyFlow(HttpServletRequest request, HttpServletResponse response, ModelMap model){
//		if(!isAdminLogin(request)){
//			return "redirect:/login";
//		}
		
		HttpRequestInfo reqInfo = new HttpRequestInfo(request);
		int currentFlowId = reqInfo.getIntAttribute("currentFlowId", 0);
		
		HttpSession session = request.getSession();
		User user = (User)session.getAttribute(Constants.SESSION_USER);
		logger.info("packagePaySessionId:"+session.getId()+",user:"+user);
		
		//查询所有的资源
		List<PackageInfo> packagelist = packageService.getList(PackageInfo.PACKAGE_TYPE_FLOW, 1, 5);
    	if(currentFlowId==0){
    		model.addAttribute("currentFlow",packagelist.get(0));
    	}else{
    		for (PackageInfo packageInfo : packagelist) {
				if(packageInfo.getId()==currentFlowId){
		    		model.addAttribute("currentFlow",packageInfo);
		    		break;
				}
			}
    	}
		model.addAttribute("flowList",packagelist);
		return "/package/buyflow";
	}
	

	
}
