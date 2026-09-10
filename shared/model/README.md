# WeDRIVE Vehicle Model Assets

The local model tree is the canonical naming reference for the 360 pipeline.
Cloudinary public IDs should mirror the same model path after the
`model/` prefix.

```text
shared/model/
└── {Category}/
    └── {Year Brand Model Variant}/
        ├── source.json
        ├── exterior/
        │   └── full-res/
        │       ├── frame-000.jpg
        │       └── frame-199.jpg
        └── interior/
            └── full-res/
                ├── pano_f.jpg
                ├── pano_b.jpg
                ├── pano_l.jpg
                ├── pano_r.jpg
                ├── pano_u.jpg
                └── pano_d.jpg
```

Example:

```text
Local model path:
Truck/2021 Toyota Hilux V Dual Cab 2.4

Cloudinary folder:
model/Truck/2021 Toyota Hilux V Dual Cab 2.4
```

The Supabase table `public.car_visual_assets` stores this local path,
Cloudinary folder, source metadata, frame URLs and processing status. Image
files themselves are stored in Cloudinary only.
