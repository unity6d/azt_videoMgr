/**
 * 
 */
package com.aepan.sysmgr.service;

import com.aepan.sysmgr.model.config.Config;
import com.aepan.sysmgr.model.config.ConfigInfo;

/**
 * @author lanker
 * 2015年8月10日上午11:22:20
 */
public interface ConfigService {

	Config query(int id);
	void update(Config c);
	void add(Config c) ;
	/**
	 * @return
	 */
	ConfigInfo getAllConfig();

}
