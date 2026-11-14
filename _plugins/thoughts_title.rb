require "cgi"

# Thoughts have no visible heading, but feed readers and browser tabs need a
# useful title. Use their opening paragraph rather than the filename fallback.
Jekyll::Hooks.register :site, :post_read do |site|
  markdown = site.find_converter_instance(Jekyll::Converters::Markdown)
  filters = Object.new.extend(Liquid::StandardFilters)

  site.posts.docs.each do |post|
    next unless post.data["layout"] == "thoughts_style"
    next unless post.data["title"] == Jekyll::Utils.titleize_slug(post.data["slug"])

    html = markdown.convert(post.content)
    opening = html.split("</p>", 2).first.to_s
    text = CGI.unescapeHTML(filters.strip_html(opening)).gsub(/[[:space:]]+/, " ").strip
    next if text.empty?

    post.data["title"] = filters.truncate(text, 100)
  end
end
