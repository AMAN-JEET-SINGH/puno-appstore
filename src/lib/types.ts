export interface App {
  id: number;
  app_id: string;
  name: string;
  developer: string;
  category: string;
  platforms: string[];
  price: string;
  rating: number;
  installs: string;
  size: string;
  updated: string;
  description: string;
  icon_file: string;
  slug: string;
  content_rating: string;
  developer_email: string;
  privacy_policy: string;
  app_type: string;
  created_at: string;
}

export interface Screenshot {
  id: number;
  app_id: string;
  file_name: string;
}
