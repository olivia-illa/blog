# Give every thoughts-style post a daily note title without changing its URL.
# Publication timestamps determine the order; paths break ties consistently.
Jekyll::Hooks.register :site, :post_read do |site|
  notes = site.posts.docs.select { |post| post.data["layout"] == "thoughts_style" }
  counts = Hash.new(0)

  notes.sort_by { |post| [post.date, post.relative_path] }.each do |post|
    day = post.date.getlocal("+08:00").strftime("%Y-%m-%d")
    number = counts[day] += 1
    post.data["title"] = case number
                        when 1 then "notes"
                        when 2 then "more notes"
                        when 3 then "even more notes"
                        else "even more notes (#{number})"
                        end
  end
end
