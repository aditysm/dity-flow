-- Fixed SQL for Supabase SQL Editor
CREATE OR REPLACE FUNCTION public.find_all_routes(
  p_source VARCHAR,
  p_destination VARCHAR,
  p_amount DECIMAL,
  p_bypass_quota INT DEFAULT 0
)
RETURNS TABLE (
  route_id INT,             
  step_number INT,
  from_institution VARCHAR,
  to_institution VARCHAR,
  fee_cost DECIMAL(12, 2),
  deduction_type VARCHAR,
  step_notes TEXT,
  total_route_fee DECIMAL(12, 2)
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH RECURSIVE transfer_graph AS (
    -- TAHAP 1: Node Asal
    SELECT 
      1 as lvl,
      r.source_id,
      r.destination_id,
      (CASE 
        WHEN p_bypass_quota = 1 AND r.fallback_fee IS NOT NULL THEN r.fallback_fee
        ELSE r.fee_value 
      END)::NUMERIC as total_fee,
      ARRAY[r.id] as edge_path,
      ARRAY[r.source_id::TEXT, r.destination_id::TEXT] as node_path
    FROM transfer_rules r
    WHERE r.source_id = p_source
      AND p_amount >= r.min_amount 
      AND p_amount <= r.max_amount

    UNION ALL

    -- TAHAP 2: Lompatan Rekursif (Maks 4 untuk kestabilan)
    SELECT 
      g.lvl + 1,
      r.source_id,
      r.destination_id,
      (g.total_fee + CASE 
        WHEN p_bypass_quota = 1 AND r.fallback_fee IS NOT NULL THEN r.fallback_fee
        ELSE r.fee_value 
      END)::NUMERIC as total_fee,
      g.edge_path || r.id,
      g.node_path || r.destination_id::TEXT
    FROM transfer_graph g
    JOIN transfer_rules r ON g.destination_id = r.source_id
    WHERE NOT (r.destination_id::TEXT = ANY(g.node_path)) 
      AND p_amount >= r.min_amount 
      AND p_amount <= r.max_amount
      AND g.lvl < 4 
  ),
  ranked_paths AS (
    -- FILTER: Urutkan SEMUA rute yang berhasil mencapai tujuan, dari termurah ke termahal
    SELECT 
      g.total_fee,
      g.edge_path,
      DENSE_RANK() OVER (ORDER BY g.total_fee ASC, g.lvl ASC) as rn 
    FROM transfer_graph g
    WHERE g.destination_id = p_destination
  )
  -- KELUARAN PENGGABUNGAN: Kembalikan SEMUA rute tanpa limitasi "WHERE rp.rn <= 3"
  SELECT 
    (rp.rn)::INT as route_id,
    (p.idx)::INT as step_number,
    t.source_id::VARCHAR as from_institution,
    t.destination_id::VARCHAR as to_institution,
    (CASE 
      WHEN p_bypass_quota = 1 AND t.fallback_fee IS NOT NULL THEN t.fallback_fee
      ELSE t.fee_value 
    END)::DECIMAL(12,2) as fee_cost,
    t.fee_deduction_type::VARCHAR as deduction_type,
    (CASE 
      WHEN p_bypass_quota = 1 AND t.fallback_fee IS NOT NULL THEN 'Limit gratis terlewati! Biaya dialihkan ke tarif reguler.'::TEXT
      ELSE t.notes 
    END)::TEXT as step_notes,
    (rp.total_fee)::DECIMAL(12,2) as total_route_fee
  FROM ranked_paths rp
  CROSS JOIN LATERAL unnest(rp.edge_path) WITH ORDINALITY AS p(rule_id, idx)
  JOIN transfer_rules t ON t.id = p.rule_id
  ORDER BY rp.rn ASC, p.idx ASC;
END;
$$;
