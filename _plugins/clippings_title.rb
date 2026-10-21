# Clippings posts are titled after what they clip: a clippings_style post
# without its own `title:` takes its `source_title` as the title, which the
# browser tab, SEO tags and feed use. Set `title:` to call one something else.
Jekyll::Hooks.register :site, :post_read do |site|
  site.posts.docs.each do |post|
    data = post.data
    next unless data["layout"] == "clippings_style" && data["source_title"]

    # Jekyll has already filled a missing title from the filename ("Clips V2"),
    # so a title equal to that one wasn't written by hand.
    next unless data["title"] == Jekyll::Utils.titleize_slug(data["slug"])

    data["title"] = data["source_title"]
  end
end
