/**
 * 
 */
package com.aepan.sysmgr.service.implement;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;










import com._21cn.framework.util.PageList;
import com.aepan.sysmgr.azure.AzureSDK;
import com.aepan.sysmgr.azure.UploadFileRps;
import com.aepan.sysmgr.dao.PackageDao;
import com.aepan.sysmgr.dao.PackageStatDao;
import com.aepan.sysmgr.dao.UserDao;
import com.aepan.sysmgr.dao.VideoDao;
import com.aepan.sysmgr.model.StoreVideo;
import com.aepan.sysmgr.model.Video;
import com.aepan.sysmgr.model.VideoCheck;
import com.aepan.sysmgr.model.config.FileConfig;
import com.aepan.sysmgr.model.packageinfo.PackageInfo;
import com.aepan.sysmgr.model.tempinfo.LinkVideoInfo;
import com.aepan.sysmgr.service.ConfigService;
import com.aepan.sysmgr.service.VideoService;
import com.aepan.sysmgr.util.ConfigManager;
import com.aepan.sysmgr.util.DateUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author Administrator
 * 2015年8月3日下午2:54:36
 */
@Service
public class VideoServiceImpl implements VideoService {
	private static final Logger logger = LoggerFactory.getLogger(VideoServiceImpl.class);
	@Autowired
	private VideoDao videoDao;
	@Autowired
	private UserDao userDao;
	@Autowired
	private PackageStatDao packageStatDao;
	@Autowired
	private PackageDao packageDao;
	@Override
	public int insert(Video v,ConfigService configService) throws Exception {
		int id = videoDao.addVideoWithGenKey(v.harmSensitiveWord());
		//异步调用上传微软云
		v.id = id;
		FileConfig config = ConfigManager.getInstance().getFileConfig(configService);
		asyncUploadAzure(v, config.FILE_LOCAL_DIR);
		return id;
	}
	private void asyncUploadAzure(Video video,String localDirPre){
		new Thread(new UploadAzure(video, localDirPre)).start(); 
	}
	private  class  UploadAzure implements Runnable {
		private Video video;
		private String localDirPre;
		public UploadAzure(Video video,String localDirPre) {
			this.video = video;
			this.localDirPre = localDirPre;
		}
		public void run() {
			azureOneVideo(video, localDirPre);
		}
	}
	@Override
	public Video get(int id) {
		return videoDao.findVideoById(id);
	}
	@Override
	public void delete(int id,int userId) {
		videoDao.delete(id);
		//更新拥有视频数量
		/*PackageStat packageStat = packageStatDao.getByUserId(userId);
		packageStat.setVideoNum((packageStat.getVideoNum()-1));
		packageStatDao.update(packageStat);*/
		//删除关联关系
		videoDao.deleteLinkRelationByVideoId(userId, id);
	}
	
	@Override
	public void update(Video v,ConfigService configService) {
		videoDao.updateVideo(v.harmSensitiveWord());
		if(v.checkState==VideoCheck.state_转码中){
			FileConfig config = ConfigManager.getInstance().getFileConfig(configService);
			asyncUploadAzure(v, config.FILE_LOCAL_DIR);
		}
	}

	@Override
	public PageList<Video> getList(Map<String, Object> params, int pageNo,
			int pageSize) {
		return videoDao.pageList(params, pageNo, pageSize);
	}
	@Override
	public PageList<Video> getListWithPatnerAccountName(Map<String, Object> params, int pageNo,
			int pageSize) {
		PageList<Video> list =  videoDao.pageList(params, pageNo, pageSize);
		Video.setParterAccountName(list, userDao);
		return list;
	}
	
	@Override
	public void batchInsert(int batchSize, List<StoreVideo> batchList,
			Integer userId) {
		videoDao.batchInsert(batchSize, batchList, userId);
		
	}

	@Override
	public boolean deleteByUserIdANDStoreId(int userId, int storeId) {
		return videoDao.deleteByUserIdANDStoreId(userId, storeId);
	}
	
	@Override
	public List<Video> getListByStoreId(int storeId, int userId){
		return videoDao.getListByStoreId(storeId, userId);
	}
	
	@Override
	public boolean active(int videoId, boolean state) {
		Video v = videoDao.findVideoById(videoId);
		v.active = state;
		videoDao.updateVideo(v);
		return true;
	}

	@Override
	public boolean check(int videoId, int state, String msg) {
		Video v = videoDao.findVideoById(videoId);
		v.checkState = state;
		if(v.checkState != VideoCheck.state_上线){
			int num = v.checkMsgs==null?0:v.checkMsgs.size();
			num++;
			VideoCheck vc = new VideoCheck(num, state, msg);
			if(v.checkMsgs!=null){
				v.checkMsgs.add(vc);
			}else{
				List<VideoCheck> vcList = new ArrayList<VideoCheck>();
				vcList.add(vc);
				v.checkMsgs = vcList;
			}			
		}
		videoDao.updateVideo(v);
		return true;
	}
	/**校验在套餐中是否有足够的数量来关联当前选中的视频*/
	@Override
	public LinkVideoInfo canLink(int userId,int packgeId,int storeId,List<StoreVideo> batchList){
		LinkVideoInfo lvi = new LinkVideoInfo();
		PackageInfo p = packageDao.getById(packgeId);
		
		if(p.getVideoNum()<batchList.size()){
			lvi.onceStoreVideoNum=batchList.size();
			lvi.onceStoreCanLinkVideoNum=p.getVideoNum();
			return lvi;
			
		}
		
		//记录用户完成本次关联后的已关联视频数量linkedVideoNum     套餐中拥有的数量canlinkVideoNum
		List<StoreVideo> linkedList  = videoDao.getStoreVideoListByUserId(userId);
		List<StoreVideo> exceptCurrList = new ArrayList<StoreVideo>();
		if(linkedList!=null&&!linkedList.isEmpty()){
			for (StoreVideo storeVideo : linkedList) {
				//获得除去当前要关联播放器相关StoreVideo后的List<StoreVideo>
				if(storeVideo.storeId != storeId){
					exceptCurrList.add(storeVideo);
				}
			}
		}
		//完成本次关联后的List<StoreVideo>
		exceptCurrList.addAll(batchList);

		int linkedVideoNum = exceptCurrList.size();
		int canlinkVideoNum = p==null?0:p.getVideoNum()*p.getPlayerNum();
		lvi.linkedVideoNum = linkedVideoNum;
		lvi.canlinkVideoNum = canlinkVideoNum;
		if(linkedVideoNum>canlinkVideoNum){
			lvi.can = false;
		}else{
			lvi.can = true;
		}
		return lvi;
	}
	
	@Override
	public int getStoreVideoCountByUserId(int userId){
		return videoDao.getStoreVideoCountByUserId(userId);
	}
	
	@Override
	public int getVideoCountByUserId(int userId){
		return videoDao.getVideoCountByUserId(userId);
		
	}
	
	@Override
	public  void addVideoCNum(int id){
		videoDao.addVideoCNum(id);
	}
	
	@Override
	public  void addH5VideoCNum(int id){
		videoDao.addH5VideoCNum(id);
	}
	
	@Override
	public float getUsedFlowNumByUserId(int userId){
		return videoDao.getUsedFlowNumByUserId(userId);
	}
	//最后修改时间在一个小时前，状态仍然是编码中的视频，执行再次上传微软云
	
	@Override
	public void azureUploadAndEncode(String localDirPre){
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("checkState", VideoCheck.state_转码中);
		int count = videoDao.pageCount(params);
		int pageSize = 100;
		int pageCount = count%pageSize==0?count/pageSize:count/pageSize+1;
		Date now = new Date();
		for(int pageNum=1;pageNum<=pageCount;pageNum++){
			List<Video> videos = videoDao.pageList(params, pageNum, pageSize);
			for (Video video : videos) {
				if(DateUtil.diff(now, video.modificationTime)>Video.REUPLOAD_AZURE_TIME){
					azureOneVideo(video,localDirPre);
				}
			}
		}
	}
	private void azureOneVideo(Video video,String localDirPre){
		File file = new File(localDirPre+"video/"+video.uploadAssetId);
		if(file!=null&&file.isFile()&&file.canRead()){
			boolean deletefile = false;
			FileInputStream fis = null ;
			try {
				fis= new FileInputStream(file);
				UploadFileRps rs = AzureSDK.upVideo(video.uploadAssetId,fis);
				if(rs.success){
					video.checkState = VideoCheck.state_待审核;
					video.uploadAssetId = rs.getUploadAssetId();
					video.encodeAssetId = rs.getEncodeAssetId();
					video.video = rs.getVedioUrl();
					video.h5Video=rs.getH5VedioUrl();
					video.videoSize=rs.getVedioFileSize()/1024f/1024;
					video.h5VideoSize=rs.getH5VedioFileSize()/1024f/1024;
					videoDao.updateVideo(video);
					deletefile = true;
				}
			} catch (IOException e) {
				logger.info("upload video to azure fail,file("+file.getAbsolutePath()+") not found");
			}finally{
				if(fis!=null){
					try {
						fis.close();
					} catch (IOException e) {
						logger.info("upload video to azure fail,close inputstream error");
					}
				}
				if(deletefile){
					file.deleteOnExit();
				}
			}
			
		}
	}
	@Override
	public String getStoreLogo(String videoIds){
		String logo = "";
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("eqIds", videoIds);
		params.put("active", Video.active_激活);
		List<Video> list = getList(params, 1, 1);
		logo = list!=null&&list.size()>0? list.get(0).imgMin:"";
		return logo;
	}
}
