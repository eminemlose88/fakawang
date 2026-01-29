-- CreateTable
CREATE TABLE "admin_users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goods_group" (
    "id" SERIAL NOT NULL,
    "gp_name" TEXT NOT NULL,
    "is_open" INTEGER NOT NULL DEFAULT 1,
    "ord" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "goods_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goods" (
    "id" SERIAL NOT NULL,
    "group_id" INTEGER NOT NULL,
    "gd_name" TEXT NOT NULL,
    "gd_description" TEXT NOT NULL,
    "gd_keywords" TEXT NOT NULL,
    "picture" TEXT,
    "retail_price" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "actual_price" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "in_stock" INTEGER NOT NULL DEFAULT 0,
    "sales_volume" INTEGER NOT NULL DEFAULT 0,
    "ord" INTEGER NOT NULL DEFAULT 1,
    "buy_limit_num" INTEGER NOT NULL DEFAULT 0,
    "buy_prompt" TEXT,
    "description" TEXT,
    "type" INTEGER NOT NULL DEFAULT 1,
    "is_open" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "goods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carmis" (
    "id" SERIAL NOT NULL,
    "goods_id" INTEGER NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "carmi" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "order_id" INTEGER,

    CONSTRAINT "carmis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "order_sn" TEXT NOT NULL,
    "goods_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "type" INTEGER NOT NULL DEFAULT 1,
    "goods_price" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "buy_amount" INTEGER NOT NULL DEFAULT 1,
    "total_price" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "actual_price" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "email" TEXT NOT NULL,
    "info" TEXT,
    "pay_id" INTEGER,
    "buy_ip" TEXT NOT NULL,
    "trade_no" TEXT DEFAULT '',
    "status" INTEGER NOT NULL DEFAULT 1,
    "search_pwd" TEXT,
    "payment_address" TEXT,
    "actual_payment_amount" DECIMAL(65,30),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pays" (
    "id" SERIAL NOT NULL,
    "pay_name" TEXT NOT NULL,
    "pay_check" TEXT NOT NULL,
    "pay_method" INTEGER NOT NULL,
    "merchant_id" TEXT,
    "merchant_key" TEXT,
    "merchant_pem" TEXT,
    "pay_handleroute" TEXT NOT NULL,
    "is_open" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_settings" (
    "slug" TEXT NOT NULL,
    "value" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "author" TEXT NOT NULL DEFAULT 'Admin',
    "tags" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "views" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_username_key" ON "admin_users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_sn_key" ON "orders"("order_sn");

-- CreateIndex
CREATE UNIQUE INDEX "pays_pay_check_key" ON "pays"("pay_check");

-- CreateIndex
CREATE UNIQUE INDEX "posts_slug_key" ON "posts"("slug");

-- AddForeignKey
ALTER TABLE "goods" ADD CONSTRAINT "goods_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "goods_group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carmis" ADD CONSTRAINT "carmis_goods_id_fkey" FOREIGN KEY ("goods_id") REFERENCES "goods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carmis" ADD CONSTRAINT "carmis_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_goods_id_fkey" FOREIGN KEY ("goods_id") REFERENCES "goods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_pay_id_fkey" FOREIGN KEY ("pay_id") REFERENCES "pays"("id") ON DELETE SET NULL ON UPDATE CASCADE;
