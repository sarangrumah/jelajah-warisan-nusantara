
import { FieldConfigs, RelationshipConfig } from '../helper/types'; // Optional: define types


export const tableConfigs = {
  banners: ['id', 'title', 'subtitle', 'description', 'image_url', 'start_date', 'end_date', 'is_published', 'created_by', 'created_at', 'updated_at'],
  news_articles: ['id', 'title', 'slug', 'excerpt', 'content', 'featured_image_url', 'is_published', 'published_at', 'created_by', 'created_at', 'updated_at'],
  agenda_items: ['id', 'title', 'description', 'event_date', 'event_time', 'location', 'image_url', 'is_published', 'created_by', 'created_at', 'updated_at'],
  museums: ['id', 'name', 'type', 'description', 'location', 'address', 'latitude', 'longitude', 'image_url', 'gallery_images', 'opening_hours', 'contact_info', 'is_published', 'created_by', 'created_at', 'updated_at'],
  career_opportunities: ['id', 'title', 'type', 'description', 'requirements', 'benefits', 'location', 'duration', 'application_deadline', 'is_published', 'created_by', 'created_at', 'updated_at'],
  career_applications: ['id', 'opportunity_id', 'full_name', 'email', 'phone', 'university', 'major', 'semester', 'program', 'motivation', 'cv_url', 'transcript_url', 'cover_letter_url', 'status', 'created_at', 'updated_at'],
  media_items: ['id', 'title', 'type', 'category', 'excerpt', 'content', 'image_url', 'file_url', 'tags', 'is_published', 'published_at', 'created_by', 'created_at', 'updated_at'],
  faqs: ['id', 'question', 'answer', 'category', 'order_index', 'is_published', 'created_by', 'created_at', 'updated_at'],
  content_sections: ['id', 'section_key', 'title', 'content', 'is_published', 'created_by', 'created_at', 'updated_at'],
  heroes: ['id', 'title', 'subtitle', 'image', 'cta', 'link_to', 'is_published', 'created_by', 'created_at', 'updated_at'],
  stats: ['id', 'icon', 'value', 'label', 'is_published', 'created_by', 'created_at', 'updated_at'],
  highlights: ['id', 'icon', 'title', 'description', 'is_published', 'created_by', 'created_at', 'updated_at'],
  services: ['id', 'icon', 'title', 'description', 'features', 'is_published', 'created_by', 'created_at', 'updated_at'],
  tb_banner : ['id', 'title','subtitle','image','button_url_1','button_url_2','start_publish_date','end_publish_date','is_active','is_approved','created_at','created_by','updated_at','updated_by'],
  // profiles: ['id','user_id','display_name','avatar_url','roles','created_at', 'updated_at'],
  user_roles:['id','user_id','role','created_at'],
  hero_slides: ['id', 'title', 'subtitle', 'cta', 'image_url', 'created_by', 'created_at', 'updated_at'],
  hero_videos: ['id', 'title', 'video', 'created_at', 'updated_at'],
  collections: ['id', 'title', 'subtitle', 'category', 'museum', 'period', 'image_url', 'description', 'material', 'dimensions', 'origin', 'discoverdYear', 'condition', 'significance', 'culturalContext', 'relatedArtifacts', 'created_at', 'updated_at'],
  heritages: ['id', 'title', 'subtitle', 'type', 'location', 'period', 'image_url', 'description', 'full_description', 'details', 'visit_info', 'created_at', 'updated_at'],
  tb_company: ['id','name','brand','address','phone','whatsapp','email',
    'website','aboutus','vision','mission','latitude','longitude',
    'created_by','created_at','updated_by','updated_at'],
  tb_company_leadership: ['id', 'name','position','is_active','company_id','created_by','created_at','updated_by','updated_at'],
  tb_company_visitor: [  // ✅ Fixed: "visitior" → "visitor"
    'id', 'visitor_count', 'year', 'is_active', 'company_id',
    'created_by', 'updated_by'
  ],
  tb_sites:['id','name','type','category','subtitle','description','address','opening_hours','phone','whatsapp','website','facilities','img_banner','ticket_price','latitude','longitude','is_active', 'is_approved','created_at','created_by','updated_at','updated_by'],
  tb_events:['id','name','category','subtitle','description','id_site','location','address','start_published_date','end_published_date','start_date','end_date','contact','website','banner_image','ticket_price','is_active','is_approved','created_at','created_by','updated_at','updated_by']
};

export const tableRelationships = {
  tb_events: {
    site: {
      table: 'tb_sites',
      localKey: 'id_site',
      foreignKey: 'id',
      type: 'left', 
      fields: ['id', 'name', 'address', 'phone', 'website', 'latitude', 'longitude', 'img_banner'] // only these are joined
    }
  },
  tb_sites: {
    company: {
      table: 'tb_company',
      localKey: 'id_company',
      foreignKey: 'id',
       type: 'left', 
      fields: ['id', 'name', 'brand', 'email', 'website']
    }
  },
  tb_company: {
    company_leadership: {
      table: 'tb_company_leadership',
      localKey: 'company_id',
      foreignKey: 'id',
      type: 'has_many',  // ← not 'left' or 'inner'
      fields: ['id', 'name', 'position', 'is_active', 'created_by', 'updated_by', 'created_at', 'updated_at']
    },
    company_visitor: {
      table: 'tb_company_visitor',
      localKey: 'company_id',
      foreignKey: 'id',
      type: 'has_many',
      fields: ['id', 'visitor_count', 'year', 'is_active', 'created_by', 'updated_by', 'created_at', 'updated_at']
    }
  }
};

export const autoJoinRelations = {
  tb_events: ['site'],
  tb_sites: ['company'],
  tb_company: ['company_leadership', 'company_visitor']
} as const;


export const approvalConfig = {
  tb_banner: {
    requiresApproval: true,
    autoActivateOnApprove: true
  },
  tb_sites: {
    requiresApproval: true,
    autoActivateOnApprove: true
  },
  tb_events: {
    requiresApproval: true,
    autoActivateOnApprove: true
  }
} as const;

type AutoJoinRelations = typeof autoJoinRelations;
type RelationKey<T extends string> = T extends keyof AutoJoinRelations
  ? (typeof autoJoinRelations)[T][number]
  : never;