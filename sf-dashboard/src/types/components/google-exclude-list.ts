
export type TPlacementType = 
  | "youtube"
  | "youtube_video"
  | "youtube_channel"
  | "youtube_playlist"
  | "app_ios"
  | "app_android"
  | "website"
  | "invalid";




export interface IPlacementItem {
  google_list_exclude_id?: number;
  placement: string;              
  type: TPlacementType;            
  name: string;                   
  site: string;                   
  created_at?: string;         
}


export interface IGoogleExcludeListData {
  name: string;
  description: string;
  placements: IPlacementItem[];
}


export interface IPaginationPlacements {
  page: number;
  size: number;
  total : number
}


// Dữ liệu đầu vào (thô từ API)
export type TAppCategoryRaw = {
  category_id: string;
  category: string;
  parent_category?: string; 
  store: string;
};


export type TPlacementNode = {
  type: "app_category";
  placement: string;
  name: string;
  site?: string;
  children?: TPlacementNode[];
};
