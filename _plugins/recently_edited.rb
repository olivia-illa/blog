require 'time'

module RecentlyEditedFilter
  def recently_edited(posts)
    posts.sort_by do |post|
      updated_at = post.to_liquid['last_modified_at'] || post.date
      updated_at = updated_at.to_liquid if updated_at.respond_to?(:to_liquid)
      Time.parse(updated_at.to_s).to_i
    end.reverse
  end
end

Liquid::Template.register_filter(RecentlyEditedFilter)
