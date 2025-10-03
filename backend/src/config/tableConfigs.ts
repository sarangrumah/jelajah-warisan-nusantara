
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
  tb_banner : ['id', 'title','subtitle','image','button_label_1','button_url_1','button_label_2','button_url_2','start_publish_date','end_publish_date','is_active','is_approved','is_rejected','reason_rejected','created_at','created_by','updated_at','updated_by'],
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
  tb_company_visitor: [
    'id', 'visitor_count', 'year', 'is_active', 'company_id',
    'created_by', 'updated_by'
  ],
  tb_images: ['id','path','sites_id'],
  tb_type_sites: ['id', 'name'],
  tb_categories_sites: ['id','name','type_id'],
  tb_categories_event: ['id','name'],
  tb_media: ['id','title','image_url','file_url','categories','subtitle','description','source','author','is_active', 'is_approved','is_rejected','reason_rejected','created_at','created_by','updated_at','updated_by','published_date'],
  tb_sites:['id','name','type','category','subtitle','description','address',
    'opening_hours','phone','whatsapp','website','facilities','img_banner','ticket_price','ticket_url','collection',
    'latitude','longitude','is_active', 'is_approved','is_rejected','reason_rejected','created_at','created_by','updated_at','updated_by'],
  tb_events:['id','name','category','subtitle','description','sites_id','location','address','start_published_date','end_published_date','start_date','end_date','contact','website','banner_img','ticket_price','ticket_url','is_active','is_approved','is_rejected','reason_rejected','created_at','created_by','updated_at','updated_by'],
  tb_faqs:  ['id','question','answer','category','order_index','file_url','is_active','is_published','created_at','created_by','updated_at','updated_by'],
  tb_sop: ['id','title','subtitle','description','publish_date','category','document_url','author','is_active','is_approved','is_rejected','reason_rejected','created_at','created_by','updated_at','updated_by']
  ,tb_career_management: [
    'id',
    'title',
    'subtitle',
    'description',
    'requirement',
    'responsibility',
    'supervisor',
    'publish_date',
    'end_publish_date',
    'position_needed',
    'period',
    'location',
    'is_active',
    'is_approved',
    'is_rejected',
    'reason_rejected',
    'created_at',
    'created_by',
    'updated_at',
    'updated_by'
  ]
  ,tb_career_submission_management: [
    'id',
    'career_id',
    'name_volunteer',
    'email',
    'mobile_phone',
    'university_name',
    'major',
    'semester',
    'ipk',
    'motivation',
    'cv_url',
    'transcript_url',
    'cover_letter_url',
    'application_status',
    'is_active',
    'created_at',
    'created_by',
    'updated_at',
    'updated_by'
  ],
  // Master Collection used by Admin page
  // Columns aligned with requested form:
  // title, subtitle, description, museum_name, discovered_year,
  // condition, material, dimensions, origin, image_url
  tb_master_collection: [
    'id',
    'title',
    'subtitle',
    'description',
    'museum_name',
    'discovered_year',
    'condition',
    'material',
    'dimensions',
    'origin',
    'image_url',
    'is_active',
    'is_approved',
    'is_rejected',
    'reason_rejected',
    'categories_id',
    'company_id',
    'created_by',
    'created_at',
    'updated_by',
    'updated_at'
  ],
  
  tb_memoryoftheworld: [
    'id',
    'title',
    'subtitle',
    'description',
    'date',
    'thumbnails',
    'start_publish_date',
    'end_publish_date',
    'is_active',
    'is_approved',
    'is_rejected',
    'reason_rejected',
    'created_by',
    'created_at',
    'updated_by',
    'updated_at',
    'categories_id'
  ],

  tb_memoryoftheworld_gallery: [
    'id',
    'id_memoryoftheworld',
    'upload_file',
    'is_active',
    'is_approved',
    'is_rejected',
    'reason_rejected',
    'created_by',
    'created_at',
    'updated_by',
    'updated_at'
  ],
  tb_categories_collections: [
    "id",
    "name",
    "created_by",
    "updated_by",
    "created_at",
    "updated_at"
  ],
 
  tb_categories_mow: ['id', 'name', 'created_by', 'created_at', 'updated_by', 'updated_at']
 
};

export const tableRelationships = {
  tb_events: {
    site: {
      table: 'tb_sites',
      localKey: 'sites_id',
      foreignKey: 'id',
      type: 'left', 
      fields: ['id', 'name', 'address'] // only these are joined
    },
    categories : {
      site: {
        table: 'tb_categories_event',
        localKey: 'category',
        foreignKey: 'id',
        type: 'left', 
        fields: ['id', 'name', 'address'] // only these are joined
      },
    }
  },
  // Memory of the World relations
  tb_memoryoftheworld: {
    galleries: {
      table: 'tb_memoryoftheworld_gallery',
      localKey: 'id_memoryoftheworld',
      foreignKey: 'id',
      type: 'has_many', 
       fields: ['id', 'upload_file', ]
    },
    category: {
      table: 'tb_categories_collections',
      localKey: 'categories_id',
      foreignKey: 'id',
      type: 'left',
      fields: ['id', 'name']
    }
  },
  tb_master_collection: {
    category: {
      table: 'tb_categories_collections',
      localKey: 'categories_id',
      foreignKey: 'id',
      type: 'left',
      fields: ['id', 'name']
    }
  },
  tb_career_submission_management: {
    career: {
      table: 'tb_career_management',
      localKey: 'career_id',
      foreignKey: 'id',
      type: 'left',
      fields: ['id', 'title']
    }
  },
  tb_sites: {
    images: {
      table: 'tb_images',
      localKey: 'sites_id',
      foreignKey: 'id',
      type: 'has_many', 
      fields: ['id', 'path']
    },
    type_relation : {
      table: 'tb_type_sites',
      localKey: 'type',
      foreignKey: 'id',
      type: 'left', 
      fields: ['id', 'name']
    },
    categories_relation : {
      table: 'tb_categories_sites',
      localKey: 'category',
      foreignKey: 'id',
      type: 'left', 
      fields: ['id', 'name']
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
  tb_sites: ['images','type','categories'],
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
  },
  tb_sop: {
    requiresApproval: true,
    autoActivateOnApprove: true
  },
  tb_career_management: {
    requiresApproval: true,
    autoActivateOnApprove: true
  },
  tb_memoryoftheworld: {
    requiresApproval: true,
    autoActivateOnApprove: true
  },
  tb_media: {
    requiresApproval: true,
    autoActivateOnApprove: true
  },
  tb_master_collection: {
    requiresApproval: true,
    autoActivateOnApprove: true
  }
} as const;

type AutoJoinRelations = typeof autoJoinRelations;
type RelationKey<T extends string> = T extends keyof AutoJoinRelations
  ? (typeof autoJoinRelations)[T][number]
  : never;
