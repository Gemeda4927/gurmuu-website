interface Props {
  selectedCategory: string;
  selectedStatus: string;
  onCategoryChange: (v: string) => void;
  onStatusChange: (v: string) => void;
}

export default function EventFilters({
  selectedCategory,
  selectedStatus,
  onCategoryChange,
  onStatusChange,
}: Props) {
  return (
    <div className="flex gap-3 flex-wrap">
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="border px-4 py-2 rounded-lg"
      >
        <option value="all">All Categories</option>
        <option value="Education">Education</option>
        <option value="Health">Health</option>
        <option value="Technology">Technology</option>
      </select>

      <select
        value={selectedStatus}
        onChange={(e) => onStatusChange(e.target.value)}
        className="border px-4 py-2 rounded-lg"
      >
        <option value="all">All Status</option>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
      </select>
    </div>
  );
}
